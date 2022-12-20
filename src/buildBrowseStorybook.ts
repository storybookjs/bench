import { Tick, timers } from 'exectimer';
import { sync as spawnSync } from 'cross-spawn';
import du from 'du';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import { chromium } from 'playwright';

import { resetStats, makeStatsServer, chromiumArgs } from './helpers/timing';
import { makeStaticServer, STATIC_STORYBOOK_PORT } from './helpers/static';

const STDIO = 'inherit';
const BUILD_DIR = 'storybook-static';

const SCRIPT_REGEX = /<script.*?src="(.[^"]*\.js)">/g;
const logger = console;

const getScripts = (html: string) => {
  // <script src="runtime~main.6a9b04192e3176eff72a.bundle.js">
  return Array.from(html.matchAll(SCRIPT_REGEX)).map(m => m[1]);
};

const bundleSize = async (buildDir: string, prefix: string, iframeScripts: string[], indexScripts: string[]) => {
  let preview = iframeScripts.find(f => f.startsWith(prefix));
  let manager = indexScripts.find(f => f.startsWith(prefix));

  // FIXME: webpack5 uses `290.d3d846e4d074e7386081.bundle.js`
  if (prefix === 'vendors') {
    manager = manager || indexScripts.find(f => !f.startsWith('main') && !f.startsWith('runtime'));
    preview = preview || iframeScripts.find(f => !f.startsWith('main') && !f.startsWith('runtime'));
  }

  // FIXME: vite uses '/assets/iframe.d7d1f891.js`, no vendors or runtime
  if (!preview && prefix === 'main') {
    preview = iframeScripts.find(f => f.startsWith('/assets/iframe'));
  }

  if (await fs.pathExists(path.join(buildDir, 'sb-manager'))) {
    manager = 'sb-manager';
  }

  if (!manager) {
    throw new Error(`Missing manager files for '${prefix}')}`);
  }

  return {
    // avoid triple-counting main.manger / runtime.manager / vendors.manager
    manager: manager === 'sb-manager' && prefix !== 'main' ? 0 : await du(path.join(buildDir, manager)),
    preview: preview ? await du(path.join(buildDir, preview)) : 0,
  };
};

const safeDu = async (filePath: string) => {
  try {
    return await du(filePath);
  } catch {
    return 0;
  }
};

export const bundleSizes = async (buildDir: string) => {
  const iframe = getScripts((await fs.readFile(path.join(buildDir, 'iframe.html'))).toString());
  const index = getScripts((await fs.readFile(path.join(buildDir, 'index.html'))).toString());

  const [main, runtime, vendors, docsDll, uiDll] = await Promise.all([
    bundleSize(buildDir, 'main', iframe, index), // in 7.0 versions this won't exist
    bundleSize(buildDir, 'runtime', iframe, index),
    bundleSize(buildDir, 'vendors', iframe, index),
    safeDu(path.join(buildDir, 'sb_dll', 'storybook_docs_dll.js')),
    safeDu(path.join(buildDir, 'sb_dll', 'storybook_ui_dll.js')),
  ]);

  return {
    manager: {
      total: main.manager + runtime.manager + vendors.manager,
      main: main.manager,
      runtime: runtime.manager,
      vendors: vendors.manager,
      uiDll,
    },
    preview: {
      total: main.preview + runtime.preview + vendors.preview,
      main: main.preview,
      runtime: runtime.preview,
      vendors: vendors.preview,
      docsDll,
    },
  };
};

export const cleanup = async () => {
  rimraf.sync(BUILD_DIR);
};

export const buildBrowseStorybook = async (extraFlags: string[]) => {
  console.log('measuring build-storybook');

  Tick.wrap(function build(done: () => void) {
    spawnSync('yarn', ['build-storybook', ...extraFlags], { stdio: STDIO });
    done();
  });

  let resolve: any;
  const promise = new Promise((res: any, rej) => {
    resolve = res;

    // if the preview doesn't load in 40s, something is wrong
    setTimeout(rej, 40000);
  });

  const stats = resetStats();
  const browser = await chromium.launch({ args: chromiumArgs });

  const staticServer = await makeStaticServer();

  let statsServer: any;
  statsServer = await makeStatsServer(stats, async () => {
    logger.log('resolving browse');
    resolve();
    logger.log('stopping stats server');
    await statsServer.stop();
    logger.log('stopping static server');
    await staticServer.stop();
    logger.log('closing browser');
    await browser.close();
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:${STATIC_STORYBOOK_PORT}/index.html`, { waitUntil: 'domcontentloaded' });

  await promise;

  const build = {
    time: {
      build: timers.build.duration(),
    },
    size: {},
  };

  const bundles = await bundleSizes(BUILD_DIR);
  const browse = {
    size: {
      total: await du(BUILD_DIR),
      ...bundles,
    },
    time: stats.time,
  };

  return { build, browse };
};
