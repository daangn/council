/* TypeScript file generated from Council_Entity_Member.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_MemberBS = require('./Council_Entity_Member.bs');

import type {Exn_t as Js_Exn_t} from '../../../src/core/shims/Js.shim';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;

// tslint:disable-next-line:interface-over-type-literal
export type organizationId = string;

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly username: string; 
  readonly name: string; 
  readonly email?: string; 
  readonly authProviders: string[]
};

// tslint:disable-next-line:interface-over-type-literal
export type state = data;

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly data: data } }
  | { tag: "DO_NOT_USE"; value: { readonly date: Date_t } };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    "Invariant"
  | { readonly id: id; readonly exn: Js_Exn_t };

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly _RE: 
    "Member"; 
  readonly id: id; 
  readonly seq: number; 
  readonly events: event[]; 
  readonly state?: state
};

export const make: (id:id, _2:{ readonly state?: state; readonly seq?: number }, _3:void) => t = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._4(Council_Entity_MemberBS.make, Arg1, Arg2.state, Arg2.seq, Arg3);
  return {_RE:result._RE, id:result.id, seq:result.seq, events:result.events.map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"DO_NOT_USE", value:ArrayItem}}), state:result.state}
};
