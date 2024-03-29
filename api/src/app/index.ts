import FastifyCookie from '@fastify/cookie';
import FastifyForm from '@fastify/formbody';
import fastify from 'fastify';

import { env } from '~/env';

import { setupAuth } from './auth';
import { setupClient } from './client';
import { setupEventStore } from './eventStore';
import { setupFga } from './fga';
import { setupGraphQL } from './graphql';
import { setupId } from './id';
import { setupPrisma } from './prisma';
import { setupPublic } from './public';
import { setupRepo } from './repo';
import { setupOTEL } from './tracer';
import { setupWorker } from './worker';

export async function makeApp(options: {
  dev: boolean;
}) {
  const app = fastify({
    logger: !options.dev || {
      transport: {
        target: 'pino-pretty',
      },
      level: 'debug',
    },
    disableRequestLogging: true,
  });

  await app.register(FastifyForm);

  const secrets = env.COOKIE_SECRETS.split(';');
  await app.register(FastifyCookie, {
    secret: secrets,
    hook: 'onRequest',
  });

  await setupOTEL(app);
  await setupPublic(app);
  await setupId(app);
  await setupPrisma(app);
  await setupEventStore(app);
  await setupRepo(app);
  await setupFga(app);
  await setupWorker(app);
  await setupAuth(app);
  await setupGraphQL(app);
  await setupClient(app);

  return app;
}
