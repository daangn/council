import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { type YogaInitialContext } from 'graphql-yoga';

export type GraphQLContext = {
  app: FastifyInstance;
  req: FastifyRequest;
};

export function contextFactory(app: FastifyInstance) {
  return async (
    serverContext: YogaInitialContext & {
      req: FastifyRequest;
      reply: FastifyReply;
    },
  ): Promise<GraphQLContext> => {
    return {
      app,
      req: serverContext.req,
    };
  };
}
