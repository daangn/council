/* TypeScript file generated from Council_Entity_Session.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_SessionBS = require('./Council_Entity_Session.bs');

import type {Exn_t as Js_Exn_t} from '../../../src/core/shims/Js.shim';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;

// tslint:disable-next-line:interface-over-type-literal
export type memberId = string;

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly subject: string; 
  readonly issuedAt: Date_t; 
  readonly expiredAt: Date_t; 
  readonly userAgent: string
};

// tslint:disable-next-line:interface-over-type-literal
export type state = 
    { tag: "Member"; value: { readonly member: memberId; readonly data: data } }
  | { tag: "Anonymous"; value: { readonly data: data } };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly data: data } }
  | { tag: "MemberConnected"; value: { readonly date: Date_t; readonly member: memberId } };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    "Invariant"
  | { tag: "IOError"; value: { readonly id: id; readonly exn: Js_Exn_t } }
  | { tag: "Uninitialized"; value: { readonly id: id } }
  | { tag: "AlreadyInitialized"; value: { readonly id: id } }
  | { tag: "AlreadyConnected"; value: {
  readonly id: id; 
  readonly exist: memberId; 
  readonly newed: memberId
} };

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly _RE: 
    "Session"; 
  readonly id: id; 
  readonly seq: number; 
  readonly events: event[]; 
  readonly state?: state
};

export const make: (id:id, _2:{ readonly state?: state; readonly seq?: number }, _3:void) => t = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._4(Council_Entity_SessionBS.make, Arg1, (Arg2.state == null ? undefined : Arg2.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg2.state.value)
    : Object.assign({TAG: 1}, Arg2.state.value)), Arg2.seq, Arg3);
  return {_RE:result._RE, id:result.id, seq:result.seq, events:result.events.map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"MemberConnected", value:ArrayItem}}), state:(result.state == null ? result.state : result.state.TAG===0
    ? {tag:"Member", value:result.state}
    : {tag:"Anonymous", value:result.state})}
};
