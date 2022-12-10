/* TypeScript file generated from Council_Entity_Organization.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Entity_OrganizationBS__Es6Import from './Council_Entity_Organization.bs';
const Council_Entity_OrganizationBS: any = Council_Entity_OrganizationBS__Es6Import;

import type {t as Council_Entity_Member_Id_t} from './Council_Entity_Member_Id.gen';

import type {t as Council_Entity_Organization_Id_t} from './Council_Entity_Organization_Id.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = Council_Entity_Organization_Id_t;

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly name: string; 
  readonly owner: Council_Entity_Member_Id_t; 
  readonly members: Council_Entity_Member_Id_t[]
};

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly id: id; readonly data?: data };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly owner: Council_Entity_Member_Id_t } }
  | { tag: "MemberAdded"; value: {
  readonly date: Date_t; 
  readonly actor: Council_Entity_Member_Id_t; 
  readonly member: Council_Entity_Member_Id_t
} };

export const make: (id:id, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_OrganizationBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};
