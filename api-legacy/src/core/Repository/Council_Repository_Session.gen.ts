/* TypeScript file generated from Council_Repository_Session.res by genType. */
/* eslint-disable import/first */


import type {Promise2_t as Js_Promise2_t} from '../../../src/core/shims/Js.shim';

import type {t as Council_Entity_Session_t} from '../../../src/core/Entity/Council_Entity_Session.gen';

// tslint:disable-next-line:interface-over-type-literal
export type queryOptions = {};

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly find: (_1:string) => Js_Promise2_t<(null | undefined | Council_Entity_Session_t)>; 
  readonly findBy: (_1:queryOptions) => Js_Promise2_t<(null | undefined | Council_Entity_Session_t)>; 
  readonly findAll: () => Js_Promise2_t<Council_Entity_Session_t[]>; 
  readonly findAllBy: (_1:queryOptions) => Js_Promise2_t<Council_Entity_Session_t[]>; 
  readonly count: () => Js_Promise2_t<number>; 
  readonly countBy: (_1:queryOptions) => Js_Promise2_t<number>
};
