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
import { setupRepo } from './repo';
// import { setupOTEL } from './tracer';

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

  await app.register(FastifyForm);

  const secrets = env.COOKIE_SECRETS.split(';');
  await app.register(FastifyCookie, {
    secret: secrets,
    hook: 'onRequest',
  });

  // See https://github.com/open-telemetry/opentelemetry-js/issues/3521
  //  await setupOTEL(app);
  await setupId(app);
  await setupPrisma(app);
  await setupEventStore(app);
  await setupRepo(app);
  await setupFga(app);
  await setupAuth(app);
  await setupGraphQL(app);
  await setupClient(app);

  return app;
}
