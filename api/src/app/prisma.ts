import { PrismaClient } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

export async function setupPrisma(app: FastifyInstance) {
  const prisma = new PrismaClient({
    log: import.meta.env.DEV
      ? [
          {
            emit: 'event',
            level: 'info',
          },
          {
            emit: 'event',
            level: 'warn',
          },
          {
            emit: 'event',
            level: 'error',
          },
          {
            emit: 'event',
            level: 'query',
          },
        ]
      : [
          {
            emit: 'event',
            level: 'info',
          },
          {
            emit: 'event',
            level: 'warn',
          },
          {
            emit: 'event',
            level: 'error',
          },
        ],
  });

  const actor = 'prisma';

  prisma.$on('info', ({ message, target, timestamp }) => {
    app.log.info({ actor, target, timestamp }, message);
  });

  prisma.$on('warn', ({ message, target, timestamp }) => {
    app.log.warn({ actor, target, timestamp }, message);
  });

  prisma.$on('error', ({ message, target, timestamp }) => {
    app.log.error({ actor, target, timestamp }, message);
  });

  prisma.$on('query', (e) => {
    console.debug();
    console.debug('query: %o', e.query);
    console.debug('params: %o', JSON.parse(e.params));
    console.debug('duration: %oms', e.duration);
  });

  await prisma.$connect();

  app
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => prisma })
    .addHook('onClose', async () => {
      await prisma.$disconnect();
    });
}

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
