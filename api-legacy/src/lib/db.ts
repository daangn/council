// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient, type Prisma } from '@prisma/client';

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger';

import { logger } from './logger';

/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error', 'query']),
});

export type TransactionClient = Prisma.TransactionClient;

handlePrismaLogging({
  db,
  logger,
  logLevels: ['info', 'warn', 'error', 'query'],
});
