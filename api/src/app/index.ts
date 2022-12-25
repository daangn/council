import FastifyCookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from '~/env';

import { setupAuth } from './auth';
import { setupClient } from './client';
import { setupEventStore } from './eventStore';
import { setupGraphQL } from './graphql';
import { setupPrisma } from './prisma';
import { setupRepo } from './repo';

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
  });

  const secrets = env.COOKIE_SECRETS.split(';');
  await app.register(FastifyCookie, {
    secret: secrets,
    hook: 'onRequest',
  });

  await setupPrisma(app);
  await setupEventStore(app);
  await setupRepo(app);
  await setupAuth(app);
  await setupGraphQL(app);
  await setupClient(app);

  return app;
}
