import { fastifyStatic } from '@fastify/static';
import { type FastifyInstance } from 'fastify';
import { publicPath } from '~/common';

export async function setupPublic(app: FastifyInstance) {
  await app.register(fastifyStatic, {
    root: publicPath,
    // @fastify/vite will decorate it
    decorateReply: false,
  });
}
