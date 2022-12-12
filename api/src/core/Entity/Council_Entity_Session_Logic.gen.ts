/* TypeScript file generated from Council_Entity_Session_Logic.res by genType. */
/* eslint-disable import/first */


const $$toJS97415009: { [key: string]: any } = {"0": "Invariant"};

// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_Session_LogicBS = require('./Council_Entity_Session_Logic.bs');

import type {data as Council_Entity_Session_data} from './Council_Entity_Session.gen';

import type {error as Council_Entity_Session_error} from './Council_Entity_Session.gen';

import type {event as Council_Entity_Session_event} from './Council_Entity_Session.gen';

import type {memberId as Council_Entity_Session_memberId} from './Council_Entity_Session.gen';

import type {t as Council_Entity_Session_t} from './Council_Entity_Session.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Transition_t = (_1:Council_Entity_Session_t, _2:Council_Entity_Session_event) => 
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error };

export const create: (t:Council_Entity_Session_t, _2:{ readonly date: Date_t; readonly data: Council_Entity_Session_data }) => 
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Session_LogicBS.create, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, events:Arg1.events.map(function _element(ArrayItem: any) { return ArrayItem.tag==="Created"
    ? Object.assign({TAG: 0}, ArrayItem.value)
    : Object.assign({TAG: 1}, ArrayItem.value)}), state:(Arg1.state == null ? undefined : Arg1.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, events:result._0.events.map(function _element(ArrayItem1: any) { return ArrayItem1.TAG===0
    ? {tag:"Created", value:ArrayItem1}
    : {tag:"MemberConnected", value:ArrayItem1}}), state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Member", value:result._0.state}
    : {tag:"Anonymous", value:result._0.state})}}
    : {tag:"Error", value:typeof(result._0) === 'object'
    ? result._0.TAG===0
      ? {tag:"IOError", value:result._0}
      : result._0.TAG===1
      ? {tag:"Uninitialized", value:result._0}
      : result._0.TAG===2
      ? {tag:"AlreadyInitialized", value:result._0}
      : {tag:"AlreadyConnected", value:result._0}
    : $$toJS97415009[result._0]}
};

export const createWithUser: (t:Council_Entity_Session_t, _2:{
  readonly date: Date_t; 
  readonly data: Council_Entity_Session_data; 
  readonly member: Council_Entity_Session_memberId
}) => 
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Entity_Session_LogicBS.createWithUser, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, events:Arg1.events.map(function _element(ArrayItem: any) { return ArrayItem.tag==="Created"
    ? Object.assign({TAG: 0}, ArrayItem.value)
    : Object.assign({TAG: 1}, ArrayItem.value)}), state:(Arg1.state == null ? undefined : Arg1.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data, Arg2.member);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, events:result._0.events.map(function _element(ArrayItem1: any) { return ArrayItem1.TAG===0
    ? {tag:"Created", value:ArrayItem1}
    : {tag:"MemberConnected", value:ArrayItem1}}), state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Member", value:result._0.state}
    : {tag:"Anonymous", value:result._0.state})}}
    : {tag:"Error", value:typeof(result._0) === 'object'
    ? result._0.TAG===0
      ? {tag:"IOError", value:result._0}
      : result._0.TAG===1
      ? {tag:"Uninitialized", value:result._0}
      : result._0.TAG===2
      ? {tag:"AlreadyInitialized", value:result._0}
      : {tag:"AlreadyConnected", value:result._0}
    : $$toJS97415009[result._0]}
};

export const connectUser: (t:Council_Entity_Session_t, _2:{ readonly date: Date_t; readonly member: Council_Entity_Session_memberId }) => 
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Session_LogicBS.connectUser, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, events:Arg1.events.map(function _element(ArrayItem: any) { return ArrayItem.tag==="Created"
    ? Object.assign({TAG: 0}, ArrayItem.value)
    : Object.assign({TAG: 1}, ArrayItem.value)}), state:(Arg1.state == null ? undefined : Arg1.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.member);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, events:result._0.events.map(function _element(ArrayItem1: any) { return ArrayItem1.TAG===0
    ? {tag:"Created", value:ArrayItem1}
    : {tag:"MemberConnected", value:ArrayItem1}}), state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Member", value:result._0.state}
    : {tag:"Anonymous", value:result._0.state})}}
    : {tag:"Error", value:typeof(result._0) === 'object'
    ? result._0.TAG===0
      ? {tag:"IOError", value:result._0}
      : result._0.TAG===1
      ? {tag:"Uninitialized", value:result._0}
      : result._0.TAG===2
      ? {tag:"AlreadyInitialized", value:result._0}
      : {tag:"AlreadyConnected", value:result._0}
    : $$toJS97415009[result._0]}
};
