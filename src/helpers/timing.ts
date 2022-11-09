import Hapi from '@hapi/hapi';

export const EVENTS = ['managerRender', 'previewRender']; // , 'storyRender'
export const STATS_PORT = 9898;

export type Stats = {
  init: number;
  time: Record<string, number | null>;
};

export const chromiumArgs = ['--no-sandbox', '--disable-setuid-sandbox'];

const now = () => new Date().getTime();

export const resetStats = (stats?: Stats) => {
  const result = stats || ({ init: now(), time: {} } as Stats);
  result.init = now();
  EVENTS.forEach(evt => (result.time[evt] = null));
  return result;
};

export const makeStatsServer = async (stats: Stats, done: any) => {
  const server = new Hapi.Server({
    host: 'localhost',
    port: STATS_PORT,
  });

  const addEvent = (event: string) => {
    server.route({
      method: 'GET',
      path: `/${event}`,
      handler: async (req: any, h: any) => {
        console.log(`HANDLER: ${event}`, stats);
        if (!stats.time[event]) {
          stats.time[event] = (now() - stats.init) * 1000000;
        }
        if (event === 'previewRender') {
          done();
        }
        return h.response('ok').code(200);
      },
    });
  };

  EVENTS.forEach(evt => addEvent(evt));
  await server.start();
  return server;
};
