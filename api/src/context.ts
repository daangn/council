import { type OpenFgaApi } from '@openfga/sdk';
import { type PrismaClient } from '@prisma/client';
import { type FastifyBaseLogger } from 'fastify';
import { type YogaInitialContext } from 'graphql-yoga';

import { prisma } from './db';
import { fga } from './fga';

export type Context = {
  fga: OpenFgaApi;
  logger: FastifyBaseLogger;
  prisma: PrismaClient;
  request: Request;
};

export type ContextFactoryBuilderProps = {
  logger: FastifyBaseLogger;
};

export interface MakeContext {
  (serverContext: YogaInitialContext): Promise<Context>;
}

export function makeContextFactory({ logger }: ContextFactoryBuilderProps): MakeContext {
  return async ({ request }) => {
    return {
      fga,
      logger,
      prisma,
      request: request.clone(),
    };
  };
}
