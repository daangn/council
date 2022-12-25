import { type FastifyInstance } from 'fastify';

import { MergeReturnType } from '~/utils';

import findMember from './findMember';
import findSession from './findSession';

type AppRepo = MergeReturnType<[typeof findSession, typeof findMember]>;

export async function setupRepo(app: FastifyInstance) {
  const repo: AppRepo = {
    ...findSession(app),
    ...findMember(app),
  };
  app.decorate('repo', repo);
}

declare module 'fastify' {
  interface FastifyInstance {
    repo: AppRepo;
  }
}
