/* TypeScript file generated from Council_Entity_Member.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Entity_MemberBS__Es6Import from './Council_Entity_Member.bs';
const Council_Entity_MemberBS: any = Council_Entity_MemberBS__Es6Import;

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
export type t = { readonly id: id; readonly data?: data };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { readonly date: Date_t; readonly data: data };

// tslint:disable-next-line:interface-over-type-literal
export type error = void;

export const make: (id:id, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_MemberBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};
