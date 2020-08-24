import jsonexport from 'jsonexport';
import fs from 'fs';

import { cleanup, buildBrowseStorybook } from './buildBrowseStorybook';
import { installAddonBench } from './installAddonBench';
import { installStorybook } from './installStorybook';
import { startStorybook } from './startStorybook';

const stub = async (arg?: any) => ({ time: {}, size: {} });
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const save = async (results: Record<string, any>) => {
  console.log('saving', JSON.stringify(results));
  const [key, val] = Object.entries(results)[0];
  const csv = await jsonexport(val);
  fs.writeFileSync(`${key}.csv`, csv);
};

const benchmark = async (installCommand: string) => {
  await cleanup();

  const install = await installStorybook(installCommand);
  // await save({ install });
  await installAddonBench();

  const start = await startStorybook();
  // await save({ start });

  const { build, browse } = await buildBrowseStorybook();
  // await save({ build });

  await save({
    bench: {
      install,
      start,
      build,
      browse,
    },
  });
};

const safeBenchmark = async (installCommand: string) => {
  try {
    await benchmark(installCommand);
  } catch (err) {
    console.log(err);
  }
};

export default () => safeBenchmark(process.argv[2]);
