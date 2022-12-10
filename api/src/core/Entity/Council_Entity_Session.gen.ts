/* TypeScript file generated from Council_Entity_Session.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Entity_SessionBS__Es6Import from './Council_Entity_Session.bs';
const Council_Entity_SessionBS: any = Council_Entity_SessionBS__Es6Import;

import type {t as Council_Entity_Member_Id_t} from './Council_Entity_Member_Id.gen';

import type {t as Council_Entity_Section_Id_t} from './Council_Entity_Section_Id.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = Council_Entity_Section_Id_t;

// tslint:disable-next-line:interface-over-type-literal
export type memberId = Council_Entity_Member_Id_t;

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
export type t = { readonly id: id; readonly state?: state };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly data: data } }
  | { tag: "MemberConnected"; value: { readonly date: Date_t; readonly member: memberId } };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    { tag: "Uninitialized"; value: { readonly id: id } }
  | { tag: "AlreadyInitialized"; value: { readonly id: id } }
  | { tag: "AlreadyConnected"; value: {
  readonly id: id; 
  readonly exist: memberId; 
  readonly newed: memberId
} };

export const make: (id:id, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_SessionBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return {id:result.id, state:(result.state == null ? result.state : result.state.TAG===0
    ? {tag:"Member", value:result.state}
    : {tag:"Anonymous", value:result.state})}
};
