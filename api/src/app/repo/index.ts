import { type FastifyInstance } from 'fastify';

import { MergeReturnType } from '~/utils';

import findMember from './findMember';
import findSession from './findSession';
import loadMembers from './loadMembers';
import queryMembers from './queryMembers';

type AppRepo = MergeReturnType<[typeof findMember, typeof findSession, typeof loadMembers]>;

export async function setupRepo(app: FastifyInstance) {
  const repo: AppRepo = {
    ...findMember(app),
    ...findSession(app),
    ...loadMembers(app),
    ...queryMembers(app),
  };
  app.decorate('repo', repo);
}

declare module 'fastify' {
  interface FastifyInstance {
    repo: AppRepo;
  }
}
