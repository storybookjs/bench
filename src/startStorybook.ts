import { spawn } from 'cross-spawn';
import { resetStats, makeStatsServer, chromiumArgs } from './helpers/timing';
import Hapi from '@hapi/hapi';
import { chromium } from 'playwright';

const DEV_PORT = 9999;
const MANAGER_PREVIEW_REGEX = /^.\s+(\d+\.?\d*) (m?s) for manager and (\d+\.?\d*) (m?s) for preview/m;
const PREVIEW_REGEX = /^.\s+(\d+\.?\d*) (m?s) for preview/m;

const logger = console;

const parseTime = (num: string, units: string) => {
  if (units === 'ms') {
    return 1000000 * parseFloat(num);
  }
  if (units === 's') {
    return 1000000000 * parseFloat(num);
  }
  throw new Error(`Unexpected unit of time ${units}`);
};

export const parseDevOutput = (output: string) => {
  //│   8.42 s for manager and 8.86 s for preview       │
  const match = MANAGER_PREVIEW_REGEX.exec(output);
  if (match) {
    return {
      manager: parseTime(match[1], match[2]),
      preview: parseTime(match[3], match[4]),
    };
  }
  //│   8.86 s for preview       │
  const match1 = PREVIEW_REGEX.exec(output);
  if (match1) {
    return {
      manager: 0,
      preview: parseTime(match1[1], match1[2]),
    };
  }

  return undefined;
};

export const startStorybook = async (extraFlags: string[]) => {
  console.log('measuring start-storybook');

  let resolveBuild: any;
  const buildFinished = new Promise((res: any) => {
    resolveBuild = res;
  });

  let resolveRender: any;
  const renderFinished = new Promise((res: any) => {
    resolveRender = res;
  });

  const stats = resetStats();
  const child = spawn('yarn', ['storybook', '-p', DEV_PORT.toString(), '--ci', ...extraFlags], {
    // For some reason, storybook dev server hangs on my dev machine (and Norbert's) if we capture
    // stderr, so just let it go through & only capture stdout for usage below
    stdio: ['inherit', 'pipe', 'inherit'],
  });

  let managerWebpack = -1;
  let previewWebpack = -1;
  child.stdout.on('data', data => {
    const output = data.toString();
    const parsed = parseDevOutput(output);
    if (parsed) {
      const { manager, preview } = parsed;
      previewWebpack = preview;
      managerWebpack = manager;
      resolveBuild();
    }
  });
  child.on('exit', () => {
    logger.log('closing start-storybook');
    resolveRender();
  });
  let statsServer: Hapi.Server;

  const browser = await chromium.launch({ args: chromiumArgs });

  statsServer = await makeStatsServer(stats, async () => {
    logger.log('killing start-storybook');
    child.kill();
    logger.log('stopping stats server');
    await statsServer.stop();
    logger.log('closing browser');
    await browser.close();
  });

  await buildFinished;

  const page = await browser.newPage();

  page.goto(`http://localhost:${DEV_PORT}/`).catch(error => {
    console.trace(`an error occured within page.goto`);
    console.log(error);
  });

  await renderFinished;

  const webpackStats = {
    managerWebpack,
    previewWebpack,
  };

  return {
    time: {
      ...webpackStats,
      ...stats.time,
    },
    size: {},
  };
};
