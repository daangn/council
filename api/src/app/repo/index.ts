import { type FastifyInstance } from 'fastify';

import { merge } from './_inject';
import findMember from './findMember';
import findMemberByAuth from './findMemberByAuth';
import findMemberByEmail from './findMemberByEmail';
import findMemberByName from './findMemberByName';
import findSession from './findSession';
import loadMemberIds from './loadMemberIds';

const injectAll = merge([
  findMember,
  findMemberByAuth,
  findMemberByEmail,
  findMemberByName,
  findSession,
  loadMemberIds,
] as const);
type AppRepo = ReturnType<typeof injectAll>;

export async function setupRepo(app: FastifyInstance) {
  app.decorate('repo', injectAll(app));
}

declare module 'fastify' {
  interface FastifyInstance {
    repo: AppRepo;
  }
}
