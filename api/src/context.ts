import { type PrismaClient } from '@prisma/client';
import { FastifyBaseLogger } from 'fastify';
import { type YogaInitialContext } from 'graphql-yoga';

import { prisma } from './db';

export type Context = {
  prisma: PrismaClient;
  logger: FastifyBaseLogger;
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
      logger,
      prisma,
    };
  };
}
