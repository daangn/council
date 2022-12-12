/* TypeScript file generated from Council_Entity_Section.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_SectionBS = require('./Council_Entity_Section.bs');

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;

// tslint:disable-next-line:interface-over-type-literal
export type memberId = string;

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly heading: string; 
  readonly body: string; 
  readonly tags: string[]
};

// tslint:disable-next-line:interface-over-type-literal
export type state = 
    { tag: "Free"; value: data }
  | { tag: "Editing"; value: { readonly by: memberId; readonly data: data } }
  | { tag: "Locked"; value: { readonly by: memberId; readonly data: data } };

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly _RE: 
    "Section"; 
  readonly id: id; 
  readonly seq: number; 
  readonly state?: state
};

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly state: state } }
  | { tag: "EditingStarted"; value: { readonly date: Date_t; readonly by: memberId } }
  | { tag: "EditingEnded"; value: { readonly date: Date_t; readonly by: memberId } }
  | { tag: "HeadingModified"; value: {
  readonly date: Date_t; 
  readonly heading: string; 
  readonly by: memberId
} }
  | { tag: "BodyModified"; value: {
  readonly date: Date_t; 
  readonly body: string; 
  readonly by: memberId
} }
  | { tag: "TagsModified"; value: {
  readonly date: Date_t; 
  readonly tags: string[]; 
  readonly by: memberId
} }
  | { tag: "Locked"; value: { readonly date: Date_t; readonly by: memberId } };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    { tag: "Uninitialized"; value: id }
  | { tag: "Locked"; value: { readonly id: id; readonly by: memberId } }
  | { tag: "Editing"; value: { readonly id: id; readonly by: memberId } };

export const make: (id:id, _2:{ readonly state?: state; readonly seq?: number }, _3:void) => t = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._4(Council_Entity_SectionBS.make, Arg1, (Arg2.state == null ? undefined : Arg2.state.tag==="Free"
    ? {TAG: 0, _0:Arg2.state.value} as any
    : Arg2.state.tag==="Editing"
    ? Object.assign({TAG: 1}, Arg2.state.value)
    : Object.assign({TAG: 2}, Arg2.state.value)), Arg2.seq, Arg3);
  return {_RE:result._RE, id:result.id, seq:result.seq, state:(result.state == null ? result.state : result.state.TAG===0
    ? {tag:"Free", value:result.state._0}
    : result.state.TAG===1
    ? {tag:"Editing", value:result.state}
    : {tag:"Locked", value:result.state})}
};
