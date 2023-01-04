import { type FastifyInstance } from 'fastify';
import { customAlphabet } from 'nanoid';

export async function setupId(app: FastifyInstance) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 13);

  app.decorate('genId', nanoid);
}

declare module 'fastify' {
  interface FastifyInstance {
    genId: () => string;
  }
}
