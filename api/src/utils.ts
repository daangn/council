import { type Tuple } from '@cometjs/core';

// @ts-ignore
export type MergeReturnType<T extends unknown[] = []> = UnionToIntersection<Tuple.MapReturnType<T>[number]>;

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
