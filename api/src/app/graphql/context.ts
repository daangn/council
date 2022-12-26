import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { type YogaInitialContext } from 'graphql-yoga';

import { Session } from '~/core';

export type GraphQLContext = {
  app: FastifyInstance;
  currentSession: Session.t | null;
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
      currentSession: serverContext.req.currentSession,
    };
  };
}
