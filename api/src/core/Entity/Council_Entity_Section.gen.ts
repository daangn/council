/* TypeScript file generated from Council_Entity_Section.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Entity_SectionBS__Es6Import from './Council_Entity_Section.bs';
const Council_Entity_SectionBS: any = Council_Entity_SectionBS__Es6Import;

import type {t as Council_Entity_Member_Id_t} from './Council_Entity_Member_Id.gen';

import type {t as Council_Entity_Section_Id_t} from './Council_Entity_Section_Id.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = Council_Entity_Section_Id_t;

// tslint:disable-next-line:interface-over-type-literal
export type memberId = Council_Entity_Member_Id_t;

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
export type t = { readonly id: id; readonly state?: state };

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

export const make: (id:id, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_SectionBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return {id:result.id, state:(result.state == null ? result.state : result.state.TAG===0
    ? {tag:"Free", value:result.state._0}
    : result.state.TAG===1
    ? {tag:"Editing", value:result.state}
    : {tag:"Locked", value:result.state})}
};
