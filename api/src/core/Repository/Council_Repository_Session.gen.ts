/* TypeScript file generated from Council_Repository_Session.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Repository_SessionBS__Es6Import from './Council_Repository_Session.bs';
const Council_Repository_SessionBS: any = Council_Repository_SessionBS__Es6Import;

import type {Promise2_t as Js_Promise2_t} from '../../../src/core/shims/Js.shim';

import type {event as Council_Entity_Session_event} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {id as Council_Entity_Session_id} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {t as Council_Entity_Session_t} from '../../../src/core/Entity/Council_Entity_Session.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly eventStream: (_1:{ readonly id: Council_Entity_Session_id; readonly seq?: number }) => Js_Promise2_t<[Council_Entity_Session_event[], number]>; readonly save: (_1:{
  readonly id: Council_Entity_Session_id; 
  readonly events: Council_Entity_Session_event[]; 
  readonly seq: number
}) => Js_Promise2_t<void> };

export const find: (t:t, _2:{ readonly id: Council_Entity_Session_id }) => Promise<(null | undefined | Council_Entity_Session_t)> = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Repository_SessionBS.find, {eventStream:function (Argid: any, Argseq: any) {
      const result1 = Arg1.eventStream({id:Argid, seq:Argseq});
      return result1
    }, save:function (Argid1: any, Argevents: any, Argseq1: any) {
      const result2 = Arg1.save({id:Argid1, events:Argevents.map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
        ? {tag:"Created", value:ArrayItem}
        : {tag:"MemberConnected", value:ArrayItem}}), seq:Argseq1});
      return result2
    }}, Arg2.id);
  return result.then(function _element($promise: any) { return ($promise == null ? $promise : {id:$promise.id, state:($promise.state == null ? $promise.state : $promise.state.TAG===0
    ? {tag:"Member", value:$promise.state}
    : {tag:"Anonymous", value:$promise.state})})})
};
