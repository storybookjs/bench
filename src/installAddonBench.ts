import fs from 'fs';
import { sync as spawnSync } from 'cross-spawn';

const ADDONS_REGEX = /(addons.*\:.*\[)/g;
const STDIO = 'inherit';

const insertAddonBench = (main: string) => {
  const lines = main.split('\n');
  const updated = lines.map(line =>
    line.replace(ADDONS_REGEX, '$1 "@storybook/addon-bench",')
  );
  return updated.join('\n');
};

export const installAddonBench = async () => {
  let commandArgs = ['add', '@storybook/addon-bench', '--dev'];
  if (isUsingYarn1()) {
    commandArgs.push('-W');
  }
  spawnSync('yarn', commandArgs, {
    stdio: STDIO,
  });
  const mainFile = '.storybook/main.js';
  const main = fs.readFileSync(mainFile).toString();
  const mainWithBench = insertAddonBench(main);
  fs.writeFileSync(mainFile, mainWithBench);
};

const isUsingYarn1 = (): boolean => {
  const yarnVersionCommand = spawnSync('yarn', ['--version']);

  if (yarnVersionCommand.status !== 0) {
    throw new Error(`🧶 Yarn must be installed to run '@storybook/bench'`);
  }

  const yarnVersion = yarnVersionCommand.output
    .toString()
    .replace(/,/g, '')
    .replace(/"/g, '');

  return /^1\.+/.test(yarnVersion);
};
