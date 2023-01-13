import { Tuple } from '@cometjs/core';
import { type FastifyInstance } from 'fastify';

import { type MergeReturnType } from '~/utils';

export interface Injectable<T extends object> {
  (app: FastifyInstance): T;
}

type DropFirst<T extends readonly unknown[]> = T extends readonly [unknown?, ...infer U] ? U : [...T];
type UnwrapDefault<T> = T extends { default: infer U } ? U : never;
type MapUnwrapDefault<Tuple extends ReadonlyArray<{ default: unknown }>, Result extends readonly unknown[] = []> = {
  finish: Result;
  step: MapUnwrapDefault<DropFirst<Tuple>, Tuple.Append<Result, UnwrapDefault<Tuple[0]>>>;
}[Tuple['length'] extends 0 ? 'finish' : 'step'];

export function merge<T extends ReadonlyArray<{ default: Injectable<object> }>>(repos: T) {
  return (app: FastifyInstance) =>
    repos.reduce((repos, repo) => Object.assign(repos, repo.default(app)), {}) as
      // @ts-ignore
      MergeReturnType<MapUnwrapDefault<T>>;
}
