import { type Callable } from '@cometjs/core';
import FastifyAuth from '@fastify/auth';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';

export async function setupAuth(app: FastifyInstance): Promise<void> {
  app.decorate('verifyCookieAndDB', async (req: FastifyRequest, reply: FastifyReply, done: Callable) => {
    done();
  });

  await app.register(FastifyAuth);

  app.route({
    method: 'GET',
    url: '/auth/token',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
      },
    },
    async handler(req, reply) {
      type Query = {
        token: string;
      };
      const query = req.query as Query;
      console.log(query.token);
    },
  });
}
