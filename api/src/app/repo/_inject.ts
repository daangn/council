import { type FastifyInstance } from 'fastify';

import { type MergeReturnType } from '~/utils';

export interface Injectable<T extends object> {
  (app: FastifyInstance): T;
}

export function merge<T extends ReadonlyArray<Injectable<object>>>(repos: T) {
  return (app: FastifyInstance) =>
    repos.reduce((repos, repo) => Object.assign(repos, repo(app)), {}) as MergeReturnType<T>;
}
