import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import path from 'path';

export const STATIC_STORYBOOK_PORT = 9899;

export const makeStaticServer = async () => {
  const server = new Hapi.Server({
    port: STATIC_STORYBOOK_PORT,
  });
  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: async (req, h) => {
      const filePath = path.join(process.cwd(), 'storybook-static', req.path);
      return h.file(filePath, { confine: false });
    },
  });

  await server.start();
  console.log('Static server:', server.info.uri);
  return server;
};
