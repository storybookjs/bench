import { spawn } from 'cross-spawn';
import { resetStats, makeStatsServer, puppeteerArgs } from './helpers/timing';
import Hapi from '@hapi/hapi';
import puppeteer from 'puppeteer';
import { format } from './helpers/format';

const WEBPACK_REGEX = /^.\s+(\d*\.?\d*) s for manager and (\d*\.?\d*) s for preview/gm;
const DEV_PORT = 9999;

const logger = console;

export const startStorybook = async () => {
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
  const child = spawn(
    'yarn',
    ['start-storybook', '-p', DEV_PORT.toString(), '--ci'],
    {
      stdio: 'pipe',
    }
  );

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
      resolveBuild();
    }
  });
  child.on('close', () => {
    logger.log('closing start-storybook');
    resolveRender();
  });
  let statsServer: Hapi.Server;

  const browser = await puppeteer.launch({ args: puppeteerArgs });

  statsServer = await makeStatsServer(stats, async () => {
    logger.log('killing start-storybook');
    child.kill();
    logger.log('stopping stats server');
    await statsServer.stop();
    logger.log('closing puppeteer');
    await browser.close();
  });

  await buildFinished;

  const page = await browser.newPage();
  await page.goto(`http://localhost:${DEV_PORT}/index.html`);

  await renderFinished;

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
