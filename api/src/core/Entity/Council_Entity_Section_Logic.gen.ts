/* TypeScript file generated from Council_Entity_Section_Logic.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_Section_LogicBS = require('./Council_Entity_Section_Logic.bs');

import type {error as Council_Entity_Section_error} from './Council_Entity_Section.gen';

import type {event as Council_Entity_Section_event} from './Council_Entity_Section.gen';

import type {memberId as Council_Entity_Section_memberId} from './Council_Entity_Section.gen';

import type {state as Council_Entity_Section_state} from './Council_Entity_Section.gen';

import type {t as Council_Entity_Section_t} from './Council_Entity_Section.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Transition_t = (_1:Council_Entity_Section_t, _2:Council_Entity_Section_event) => 
    { tag: "Ok"; value: Council_Entity_Section_t }
  | { tag: "Error"; value: Council_Entity_Section_error };

export const create: (t:Council_Entity_Section_t, _2:{ readonly date: Date_t; readonly state: Council_Entity_Section_state }) => [
    { tag: "Ok"; value: Council_Entity_Section_t }
  | { tag: "Error"; value: Council_Entity_Section_error }, Council_Entity_Section_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Section_LogicBS.create, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Arg1.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg1.state.value)
    : Object.assign({TAG: 2}, Arg1.state.value))}, Arg2.date, Arg2.state.tag==="Free"
    ? {TAG: 0, _0:Arg2.state.value} as any
    : Arg2.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg2.state.value)
    : Object.assign({TAG: 2}, Arg2.state.value));
  return [result[0].TAG===0
    ? {tag:"Ok", value:{_RE:result[0]._0._RE, id:result[0]._0.id, seq:result[0]._0.seq, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : result[0]._0.state.TAG===1
    ? {tag:"Editing", value:result[0]._0.state}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : result[0]._0.TAG===1
    ? {tag:"Locked", value:result[0]._0}
    : {tag:"Editing", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:{date:ArrayItem.date, state:ArrayItem.state.TAG===0
    ? {tag:"Free", value:ArrayItem.state._0}
    : ArrayItem.state.TAG===1
    ? {tag:"Editing", value:ArrayItem.state}
    : {tag:"Locked", value:ArrayItem.state}}}
    : ArrayItem.TAG===1
    ? {tag:"EditingStarted", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"EditingEnded", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"HeadingModified", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"BodyModified", value:ArrayItem}
    : ArrayItem.TAG===5
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const modifyHeading: (t:Council_Entity_Section_t, _2:{
  readonly date: Date_t; 
  readonly heading: string; 
  readonly by: Council_Entity_Section_memberId
}) => [
    { tag: "Ok"; value: Council_Entity_Section_t }
  | { tag: "Error"; value: Council_Entity_Section_error }, Council_Entity_Section_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Entity_Section_LogicBS.modifyHeading, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Arg1.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg1.state.value)
    : Object.assign({TAG: 2}, Arg1.state.value))}, Arg2.date, Arg2.heading, Arg2.by);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{_RE:result[0]._0._RE, id:result[0]._0.id, seq:result[0]._0.seq, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : result[0]._0.state.TAG===1
    ? {tag:"Editing", value:result[0]._0.state}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : result[0]._0.TAG===1
    ? {tag:"Locked", value:result[0]._0}
    : {tag:"Editing", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:{date:ArrayItem.date, state:ArrayItem.state.TAG===0
    ? {tag:"Free", value:ArrayItem.state._0}
    : ArrayItem.state.TAG===1
    ? {tag:"Editing", value:ArrayItem.state}
    : {tag:"Locked", value:ArrayItem.state}}}
    : ArrayItem.TAG===1
    ? {tag:"EditingStarted", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"EditingEnded", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"HeadingModified", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"BodyModified", value:ArrayItem}
    : ArrayItem.TAG===5
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const modifyBody: (t:Council_Entity_Section_t, _2:{
  readonly date: Date_t; 
  readonly body: string; 
  readonly by: Council_Entity_Section_memberId
}) => [
    { tag: "Ok"; value: Council_Entity_Section_t }
  | { tag: "Error"; value: Council_Entity_Section_error }, Council_Entity_Section_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Entity_Section_LogicBS.modifyBody, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Arg1.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg1.state.value)
    : Object.assign({TAG: 2}, Arg1.state.value))}, Arg2.date, Arg2.body, Arg2.by);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{_RE:result[0]._0._RE, id:result[0]._0.id, seq:result[0]._0.seq, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : result[0]._0.state.TAG===1
    ? {tag:"Editing", value:result[0]._0.state}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : result[0]._0.TAG===1
    ? {tag:"Locked", value:result[0]._0}
    : {tag:"Editing", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:{date:ArrayItem.date, state:ArrayItem.state.TAG===0
    ? {tag:"Free", value:ArrayItem.state._0}
    : ArrayItem.state.TAG===1
    ? {tag:"Editing", value:ArrayItem.state}
    : {tag:"Locked", value:ArrayItem.state}}}
    : ArrayItem.TAG===1
    ? {tag:"EditingStarted", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"EditingEnded", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"HeadingModified", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"BodyModified", value:ArrayItem}
    : ArrayItem.TAG===5
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const modifyTags: (t:Council_Entity_Section_t, _2:{
  readonly date: Date_t; 
  readonly tags: string[]; 
  readonly by: Council_Entity_Section_memberId
}) => [
    { tag: "Ok"; value: Council_Entity_Section_t }
  | { tag: "Error"; value: Council_Entity_Section_error }, Council_Entity_Section_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Entity_Section_LogicBS.modifyTags, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Arg1.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg1.state.value)
    : Object.assign({TAG: 2}, Arg1.state.value))}, Arg2.date, Arg2.tags, Arg2.by);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{_RE:result[0]._0._RE, id:result[0]._0.id, seq:result[0]._0.seq, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : result[0]._0.state.TAG===1
    ? {tag:"Editing", value:result[0]._0.state}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : result[0]._0.TAG===1
    ? {tag:"Locked", value:result[0]._0}
    : {tag:"Editing", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:{date:ArrayItem.date, state:ArrayItem.state.TAG===0
    ? {tag:"Free", value:ArrayItem.state._0}
    : ArrayItem.state.TAG===1
    ? {tag:"Editing", value:ArrayItem.state}
    : {tag:"Locked", value:ArrayItem.state}}}
    : ArrayItem.TAG===1
    ? {tag:"EditingStarted", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"EditingEnded", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"HeadingModified", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"BodyModified", value:ArrayItem}
    : ArrayItem.TAG===5
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const lock: (t:Council_Entity_Section_t, _2:{ readonly date: Date_t; readonly by: Council_Entity_Section_memberId }) => [
    { tag: "Ok"; value: Council_Entity_Section_t }
  | { tag: "Error"; value: Council_Entity_Section_error }, Council_Entity_Section_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Section_LogicBS.lock, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Arg1.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg1.state.value)
    : Object.assign({TAG: 2}, Arg1.state.value))}, Arg2.date, Arg2.by);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{_RE:result[0]._0._RE, id:result[0]._0.id, seq:result[0]._0.seq, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : result[0]._0.state.TAG===1
    ? {tag:"Editing", value:result[0]._0.state}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : result[0]._0.TAG===1
    ? {tag:"Locked", value:result[0]._0}
    : {tag:"Editing", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:{date:ArrayItem.date, state:ArrayItem.state.TAG===0
    ? {tag:"Free", value:ArrayItem.state._0}
    : ArrayItem.state.TAG===1
    ? {tag:"Editing", value:ArrayItem.state}
    : {tag:"Locked", value:ArrayItem.state}}}
    : ArrayItem.TAG===1
    ? {tag:"EditingStarted", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"EditingEnded", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"HeadingModified", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"BodyModified", value:ArrayItem}
    : ArrayItem.TAG===5
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};
