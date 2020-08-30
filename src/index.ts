import jsonexport from 'jsonexport';
import program from 'commander';
import fs from 'fs';

import { cleanup, buildBrowseStorybook } from './buildBrowseStorybook';
import { installStorybook } from './installStorybook';
import { startStorybook } from './startStorybook';

import { upload } from './upload';
import { formatNumber } from './helpers/format';

const stub = (arg?: any) => ({ time: {}, size: {} });
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const save = async (results: Record<string, any>, label: string) => {
  const csv = await jsonexport(results);
  fs.writeFileSync(`${label}.csv`, csv);
  fs.writeFileSync(`${label}.json`, JSON.stringify(results));
};

const benchmark = async (installCommand: string) => {
  await cleanup();

  const install = await installStorybook(installCommand);
  const start = await startStorybook();
  const { build, browse } = await buildBrowseStorybook();

  const bench = formatNumber({ install, start, build, browse });
  await save(bench, 'bench');

  return bench;
};

export const main = async () => {
  program.arguments('<installCommand>');
  program.option('-u, --upload <label>');
  program.parse(process.argv);
  if (!program.args.length) {
    program.help();
  }

  const installCommand = program.args[0];
  const label: string = program.upload;

  const bench = await benchmark(installCommand);
  if (label) {
    await upload(bench, label);
  }
};
