import { PrismaClient } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

export async function setupPrisma(app: FastifyInstance) {
  const prisma = new PrismaClient({
    log: import.meta.env.DEV ? ['info', 'warn', 'error', 'query'] : ['info', 'warn', 'error'],
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
