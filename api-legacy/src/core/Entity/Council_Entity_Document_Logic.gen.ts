/* TypeScript file generated from Council_Entity_Document_Logic.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_Document_LogicBS = require('./Council_Entity_Document_Logic.bs');

import type {data as Council_Entity_Document_data} from './Council_Entity_Document.gen';

import type {error as Council_Entity_Document_error} from './Council_Entity_Document.gen';

import type {event as Council_Entity_Document_event} from './Council_Entity_Document.gen';

import type {memberId as Council_Entity_Document_memberId} from './Council_Entity_Document.gen';

import type {sectionId as Council_Entity_Document_sectionId} from './Council_Entity_Document.gen';

import type {t as Council_Entity_Document_t} from './Council_Entity_Document.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Transition_t = (_1:Council_Entity_Document_t, _2:Council_Entity_Document_event) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error };

export const create: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly data: Council_Entity_Document_data }) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Document_LogicBS.create, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Free", value:result._0.state._0}
    : {tag:"Locked", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0._0}
    : {tag:"Locked", value:result._0._0}}
};

export const addSection: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly section: Council_Entity_Document_sectionId }) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Document_LogicBS.addSection, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.section);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Free", value:result._0.state._0}
    : {tag:"Locked", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0._0}
    : {tag:"Locked", value:result._0._0}}
};

export const deleteSection: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly section: Council_Entity_Document_sectionId }) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Document_LogicBS.deleteSection, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.section);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Free", value:result._0.state._0}
    : {tag:"Locked", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0._0}
    : {tag:"Locked", value:result._0._0}}
};

export const assignResponsibility: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly responsibility: Council_Entity_Document_memberId }) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Document_LogicBS.assignResponsibility, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.responsibility);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Free", value:result._0.state._0}
    : {tag:"Locked", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0._0}
    : {tag:"Locked", value:result._0._0}}
};

export const modifyTags: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly tags: string[] }) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Document_LogicBS.modifyTags, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.tags);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Free", value:result._0.state._0}
    : {tag:"Locked", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0._0}
    : {tag:"Locked", value:result._0._0}}
};

export const lock: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly by: Council_Entity_Document_memberId }) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error } = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Document_LogicBS.lock, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.by);
  return result.TAG===0
    ? {tag:"Ok", value:{_RE:result._0._RE, id:result._0.id, seq:result._0.seq, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"Free", value:result._0.state._0}
    : {tag:"Locked", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0._0}
    : {tag:"Locked", value:result._0._0}}
};
