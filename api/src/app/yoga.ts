import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { createYoga } from 'graphql-yoga';

import { builder } from './builder';
import { type Context, contextFactory } from './context';

export async function setupYoga(app: FastifyInstance): Promise<void> {
  const graphQLServer = createYoga<
    {
      req: FastifyRequest;
      reply: FastifyReply;
    },
    Context
  >({
    context: contextFactory,
    schema: builder.toSchema(),
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg)),
    },
  });

  app.addContentTypeParser('multipart/form-data', {}, (req, payload, done) => done(null));

  app.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await graphQLServer.handleNodeRequest(req, { req, reply });
      for (const [name, value] of response.headers) {
        reply.header(name, value);
      }
      reply.status(response.status);
      reply.send(response.body);
      return reply;
    },
  });
}
