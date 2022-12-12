/* TypeScript file generated from Council_Service_Session.res by genType. */
/* eslint-disable import/first */


const $$toJS97415009: { [key: string]: any } = {"0": "Invariant"};

// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Service_SessionBS = require('./Council_Service_Session.bs');

import type {data as Council_Entity_Session_data} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {error as Council_Entity_Session_error} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {eventStore as Council_Domain_eventStore} from '../../../src/core/Council_Domain.gen';

import type {id as Council_Entity_Session_id} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {t as Council_Entity_Session_t} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {t as Council_Repository_Session_t} from '../../../src/core/Repository/Council_Repository_Session.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly eventStore: Council_Domain_eventStore; readonly sessionRepository: Council_Repository_Session_t };

export const make: (_1:{ readonly eventStore: Council_Domain_eventStore; readonly sessionRepository: Council_Repository_Session_t }) => t = function (Arg1: any) {
  const result = Curry._2(Council_Service_SessionBS.make, {persist:function (Arg11: any) {
      const result1 = Arg1.eventStore.persist(Arg11.TAG===0
        ? {tag:"Session", value:{_RE:Arg11._0._RE, id:Arg11._0.id, seq:Arg11._0.seq, events:Arg11._0.events.map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
        ? {tag:"Created", value:ArrayItem}
        : {tag:"MemberConnected", value:ArrayItem}}), state:(Arg11._0.state == null ? Arg11._0.state : Arg11._0.state.TAG===0
        ? {tag:"Member", value:Arg11._0.state}
        : {tag:"Anonymous", value:Arg11._0.state})}}
        : {tag:"Member", value:{_RE:Arg11._0._RE, id:Arg11._0.id, seq:Arg11._0.seq, events:Arg11._0.events.map(function _element(ArrayItem1: any) { return ArrayItem1.TAG===0
        ? {tag:"Created", value:ArrayItem1}
        : {tag:"DO_NOT_USE", value:ArrayItem1}}), state:Arg11._0.state}});
      return result1
    }}, Arg1.sessionRepository);
  return {eventStore:{persist:function (Arg12: any) {
      const result2 = result.eventStore.persist(Arg12.tag==="Session"
        ? {TAG: 0, _0:{_RE:Arg12.value._RE, id:Arg12.value.id, seq:Arg12.value.seq, events:Arg12.value.events.map(function _element(ArrayItem2: any) { return ArrayItem2.tag==="Created"
        ? Object.assign({TAG: 0}, ArrayItem2.value)
        : Object.assign({TAG: 1}, ArrayItem2.value)}), state:(Arg12.value.state == null ? undefined : Arg12.value.state.tag==="Member"
        ? Object.assign({TAG: 0}, Arg12.value.state.value)
        : Object.assign({TAG: 1}, Arg12.value.state.value))}} as any
        : {TAG: 1, _0:{_RE:Arg12.value._RE, id:Arg12.value.id, seq:Arg12.value.seq, events:Arg12.value.events.map(function _element(ArrayItem3: any) { return ArrayItem3.tag==="Created"
        ? Object.assign({TAG: 0}, ArrayItem3.value)
        : Object.assign({TAG: 1}, ArrayItem3.value)}), state:Arg12.value.state}} as any);
      return result2
    }}, sessionRepository:result.sessionRepository}
};

export const findOrCreateSession: (t:t, _2:{
  readonly id: Council_Entity_Session_id; 
  readonly date: Date_t; 
  readonly data: Council_Entity_Session_data
}) => Promise<
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error }> = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Service_SessionBS.findOrCreateSession, {eventStore:{persist:function (Arg11: any) {
      const result1 = Arg1.eventStore.persist(Arg11.TAG===0
        ? {tag:"Session", value:{_RE:Arg11._0._RE, id:Arg11._0.id, seq:Arg11._0.seq, events:Arg11._0.events.map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
        ? {tag:"Created", value:ArrayItem}
        : {tag:"MemberConnected", value:ArrayItem}}), state:(Arg11._0.state == null ? Arg11._0.state : Arg11._0.state.TAG===0
        ? {tag:"Member", value:Arg11._0.state}
        : {tag:"Anonymous", value:Arg11._0.state})}}
        : {tag:"Member", value:{_RE:Arg11._0._RE, id:Arg11._0.id, seq:Arg11._0.seq, events:Arg11._0.events.map(function _element(ArrayItem1: any) { return ArrayItem1.TAG===0
        ? {tag:"Created", value:ArrayItem1}
        : {tag:"DO_NOT_USE", value:ArrayItem1}}), state:Arg11._0.state}});
      return result1
    }}, sessionRepository:Arg1.sessionRepository}, Arg2.id, Arg2.date, Arg2.data);
  return result.then(function _element($promise: any) { return $promise.TAG===0
    ? {tag:"Ok", value:{_RE:$promise._0._RE, id:$promise._0.id, seq:$promise._0.seq, events:$promise._0.events.map(function _element(ArrayItem2: any) { return ArrayItem2.TAG===0
    ? {tag:"Created", value:ArrayItem2}
    : {tag:"MemberConnected", value:ArrayItem2}}), state:($promise._0.state == null ? $promise._0.state : $promise._0.state.TAG===0
    ? {tag:"Member", value:$promise._0.state}
    : {tag:"Anonymous", value:$promise._0.state})}}
    : {tag:"Error", value:typeof($promise._0) === 'object'
    ? $promise._0.TAG===0
      ? {tag:"IOError", value:$promise._0}
      : $promise._0.TAG===1
      ? {tag:"Uninitialized", value:$promise._0}
      : $promise._0.TAG===2
      ? {tag:"AlreadyInitialized", value:$promise._0}
      : {tag:"AlreadyConnected", value:$promise._0}
    : $$toJS97415009[$promise._0]}})
};
