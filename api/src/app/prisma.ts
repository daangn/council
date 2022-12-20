import { PrismaClient } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

export async function setupPrisma(app: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient({
    log: import.meta.env.DEV ? ['info', 'warn', 'error', 'query'] : ['info', 'warn', 'error'],
  });

  await prisma.$connect();

  app
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => prisma })
    .addHook('onClose', async (_app, done) => {
      await prisma.$disconnect();
      done();
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
