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
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const save = async (results: Record<string, any>, label: string) => {
  const csv = await jsonexport(results);
  fs.writeFileSync(`${label}.csv`, csv);
  fs.writeFileSync(`${label}.json`, JSON.stringify(results));
};

interface Options {
  installCommand: string;
  label: string;
  extraFlags: string[];
}

const benchmark = async ({ installCommand, label, extraFlags }: Options) => {
  await cleanup();

  const install = await installStorybook(installCommand);
  const start = await startStorybook(extraFlags);
  const { build, browse } = await buildBrowseStorybook(extraFlags);

  const bench = formatNumber({ install, start, build, browse });
  await save(bench, label);

  return bench;
};

export const main = async () => {
  program.arguments('<installCommand>');
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
  program.parse(process.argv);
  if (!program.args.length) {
    program.help();
  }

  const { label, extraFlags } = program;
  const installCommand = program.args[0];
  const flags = extraFlags.length > 0 ? extraFlags.split(' ') : [];

  const bench = await benchmark({ installCommand, label, extraFlags: flags });
  if (SB_BENCH_UPLOAD) {
    await upload(bench, label);
  }
};
