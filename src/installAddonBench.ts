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
  spawnSync('yarn', ['add', '@storybook/addon-bench', '--dev', '-W'], {
    stdio: STDIO,
  });
  const mainFile = '.storybook/main.js';
  const main = fs.readFileSync(mainFile).toString();
  const mainWithBench = insertAddonBench(main);
  fs.writeFileSync(mainFile, mainWithBench);
};
