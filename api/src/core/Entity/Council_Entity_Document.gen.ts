/* TypeScript file generated from Council_Entity_Document.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Entity_DocumentBS__Es6Import from './Council_Entity_Document.bs';
const Council_Entity_DocumentBS: any = Council_Entity_DocumentBS__Es6Import;

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type id = string;

// tslint:disable-next-line:interface-over-type-literal
export type sectionId = string;

// tslint:disable-next-line:interface-over-type-literal
export type memberId = string;

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly title: string; 
  readonly sections: sectionId[]; 
  readonly tags: string[]; 
  readonly owner: memberId; 
  readonly responsibility: memberId
};

// tslint:disable-next-line:interface-over-type-literal
export type state = 
    { tag: "Free"; value: data }
  | { tag: "Locked"; value: { readonly by: memberId; readonly data: data } };

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly id: id; readonly state?: state };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly data: data } }
  | { tag: "SectionAdded"; value: { readonly date: Date_t; readonly section: sectionId } }
  | { tag: "SectionDeleted"; value: { readonly date: Date_t; readonly section: sectionId } }
  | { tag: "ResponsibilityAssigned"; value: { readonly date: Date_t; readonly responsibility: memberId } }
  | { tag: "TagsModified"; value: { readonly date: Date_t; readonly tags: string[] } }
  | { tag: "Locked"; value: { readonly date: Date_t; readonly by: memberId } };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    { tag: "Uninitialized"; value: id }
  | { tag: "Locked"; value: id };

export const make: (id:id, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_DocumentBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return {id:result.id, state:(result.state == null ? result.state : result.state.TAG===0
    ? {tag:"Free", value:result.state._0}
    : {tag:"Locked", value:result.state})}
};
