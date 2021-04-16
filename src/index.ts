import jsonexport from 'jsonexport';
import program from 'commander';
import fs from 'fs';

import { cleanup, buildBrowseStorybook } from './buildBrowseStorybook';
import { installStorybook } from './installStorybook';
import { startStorybook } from './startStorybook';

import { upload } from './upload';
import { formatNumber } from './helpers/format';
import { SB_BENCH_UPLOAD } from './environment';

const stub = (arg?: any) => ({ time: {}, size: {} });
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const save = async (results: Record<string, any>, label: string) => {
  const csv = await jsonexport(results);
  fs.writeFileSync(`${label}.csv`, csv);
  fs.writeFileSync(`${label}.json`, JSON.stringify(results));
};

interface Options {
  installCommand: string;
  label: string;
  extraFlags: string[];
  benchmarks: {
    install: boolean;
    start: boolean;
    browse: boolean;
  };
}

const benchmark = async ({
  installCommand,
  label,
  extraFlags,
  benchmarks,
}: Options) => {
  await cleanup();

  const install = benchmarks.install
    ? await installStorybook(installCommand)
    : {};
  const start = benchmarks.start ? await startStorybook(extraFlags) : {};
  const browse = benchmarks.browse
    ? await buildBrowseStorybook(extraFlags)
    : { build: {}, browse: {} };

  const bench = formatNumber({ install, start, ...browse });
  await save(bench, label);

  return bench;
};

export const main = async () => {
  program.arguments('[installCommand]');
  program.option(
    '-l, --label <label>',
    'Save as <label>.csv/json and upload with <label> if SB_BENCH_UPLOAD is true',
    'bench'
  );
  program.option(
    '-e, --extra-flags <flags>',
    'Run storybook with extra flags (e.g. "--no-dll")',
    ''
  );
  program.option('--no-install', 'Do not measure storybook install time');
  program.option('--no-start', 'Do not measure storybook start time');
  program.option('--no-browse', 'Do not measure storybook browse time');
  program.parse(process.argv);
  if (program.install && !program.args.length) {
    program.help();
  }

  const { label, extraFlags, install, start, browse } = program;
  const installCommand = program.args[0];
  const flags = extraFlags.length > 0 ? extraFlags.split(' ') : [];

  const bench = await benchmark({
    installCommand,
    label,
    extraFlags: flags,
    benchmarks: {
      install,
      start,
      browse,
    },
  });
  if (SB_BENCH_UPLOAD) {
    await upload(bench, label);
  }
};
