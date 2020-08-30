import { sync as spawnSync } from 'cross-spawn';
import du from 'du';
import { Tick, timers } from 'exectimer';
import { installAddonBench } from './installAddonBench';

const NODE_MODULES = 'node_modules';
const STDIO = 'inherit';

export const installStorybook = async (installCommand: string) => {
  console.log('measuring install');

  const initialSize = await du(NODE_MODULES);
  Tick.wrap(function install(done: () => void) {
    if (installCommand) {
      const [cmd, ...args] = installCommand.split(' ');
      spawnSync(cmd, args, { stdio: STDIO });
    } else {
      console.warn('No install command provided');
    }
    done();
  });
  const finalSize = await du(NODE_MODULES);

  // Add instrumentation addon AFTER we've measured install size
  await installAddonBench();

  return {
    size: { total: finalSize - initialSize },
    time: { total: timers.install.duration() },
  };
};
