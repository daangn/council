import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: import.meta.env.DEV ? ['info', 'warn', 'error', 'query'] : ['info', 'warn', 'error'],
});
