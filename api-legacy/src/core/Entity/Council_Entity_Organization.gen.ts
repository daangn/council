/* TypeScript file generated from Council_Entity_Organization.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_OrganizationBS = require('./Council_Entity_Organization.bs');

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;

// tslint:disable-next-line:interface-over-type-literal
export type memberId = string;

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly name: string; 
  readonly owner: memberId; 
  readonly members: memberId[]
};

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly _RE: 
    "Organization"; 
  readonly id: id; 
  readonly seq: number; 
  readonly data?: data
};

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly owner: memberId } }
  | { tag: "MemberAdded"; value: {
  readonly date: Date_t; 
  readonly actor: memberId; 
  readonly member: memberId
} };

export const make: (id:id, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_OrganizationBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};
