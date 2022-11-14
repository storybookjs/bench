import fs from 'fs';
import { sync as spawnSync } from 'cross-spawn';

const ADDONS_REGEX = /(addons.*\:.*\[)/g;
const STDIO = 'inherit';

const insertAddonBench = (main: string) => {
  const lines = main.split('\n');
  const updated = lines.map(line => line.replace(ADDONS_REGEX, '$1 "@storybook/addon-bench",'));
  return updated.join('\n');
};

const findMainJs = () => {
  return ['js', 'cjs', 'mjs', 'ts'].map(suffix => `.storybook/main.${suffix}`).find(fname => fs.existsSync(fname));
};

export const installAddonBench = async () => {
  let commandArgs = ['add', '@storybook/addon-bench@next', '--dev'];
  if (isUsingYarn1()) {
    commandArgs.push('-W');
  }
  spawnSync('yarn', commandArgs, {
    stdio: STDIO,
  });
  const mainFile = findMainJs();
  if (!mainFile) throw new Error('No main.js found!');
  const main = fs.readFileSync(mainFile).toString();
  if (!main.includes('@storybook/addon-bench')) {
    const mainWithBench = insertAddonBench(main);
    fs.writeFileSync(mainFile, mainWithBench);
  }
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
