import { type FastifyInstance } from 'fastify';
import * as Worker from 'graphile-worker';

import { env } from '~/env';

export async function setupWorker(app: FastifyInstance) {
  const actor = 'graphile-worker';
  const logger = new Worker.Logger(function graphileLoggerFactory(scope) {
    return (level, message, _meta) => {
      switch (level) {
        case 'info':
          app.log.info({ actor, scope, level }, message);
          break;
        case 'warning':
          app.log.warn({ actor, scope, level }, message);
          break;
        case 'error':
          app.log.error({ actor, scope, level }, message);
          break;
        case 'debug':
          app.log.debug({ actor, scope, level }, message);
          break;
      }
    };
  });

  await Worker.runMigrations({
    logger,
    connectionString: env.DATABASE_URL,
  });

  const worker = await Worker.run({
    logger,
    connectionString: env.DATABASE_URL,
    taskList: {
      hello: async (payload, helpers) => {
        const { name } = payload;
        helpers.logger.info(`Hello, ${name}`);
      },
    },
  });

  app.decorate('worker', worker).addHook('onClose', async () => {
    await worker.stop();
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    worker: Worker.Runner;
  }
}
