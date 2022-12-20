import { type OpenFgaApi } from '@openfga/sdk';
import { type PrismaClient } from '@prisma/client';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { type YogaInitialContext } from 'graphql-yoga';

export type Context = {
  fga: OpenFgaApi;
  prisma: PrismaClient;
  req: FastifyRequest;
};

export async function contextFactory(
  serverContext: YogaInitialContext & {
    req: FastifyRequest;
    reply: FastifyReply;
  },
): Promise<Context> {
  return {
    fga: serverContext.req.fga,
    prisma: serverContext.req.prisma,
    req: serverContext.req,
  };
}
