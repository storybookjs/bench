import { spawn } from 'cross-spawn';
import { resetStats, makeStatsServer } from './helpers/timing';
import Hapi from '@hapi/hapi';
import { format } from './helpers/format';

const WEBPACK_REGEX = /^.\s+(\d*\.?\d*) s for manager and (\d*\.?\d*) s for preview/gm;

export const startStorybook = async () => {
  console.log('measuring start-storybook');

  let resolve: any;
  const promise = new Promise((res: any) => {
    resolve = res;
  });

  const stats = resetStats();
  const child = spawn('yarn', ['start-storybook'], {
    stdio: 'pipe',
  });

  let managerWebpack = -1;
  let previewWebpack = -1;
  child.stdout.on('data', data => {
    //│   8.42 s for manager and 8.86 s for preview       │
    const output = data.toString();
    const match = WEBPACK_REGEX.exec(output);
    if (match) {
      console.log({ match });
      managerWebpack = 1000000000 * parseFloat(match[1]);
      previewWebpack = 1000000000 * parseFloat(match[2]);
    }
  });
  child.on('close', () => {
    resolve();
  });
  let statsServer: Hapi.Server;
  statsServer = await makeStatsServer(stats, async () => {
    await statsServer.stop();
    child.kill();
  });

  await promise;

  const webpackStats = {
    managerWebpack,
    previewWebpack,
  };

  return format({
    time: {
      ...webpackStats,
      ...stats.time,
    },
    size: {},
  });
};
