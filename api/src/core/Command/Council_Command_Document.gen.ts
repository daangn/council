/* TypeScript file generated from Council_Command_Document.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Command_DocumentBS__Es6Import from './Council_Command_Document.bs';
const Council_Command_DocumentBS: any = Council_Command_DocumentBS__Es6Import;

import type {data as Council_Entity_Document_data} from '../../../src/core/Entity/Council_Entity_Document.gen';

import type {error as Council_Entity_Document_error} from '../../../src/core/Entity/Council_Entity_Document.gen';

import type {event as Council_Entity_Document_event} from '../../../src/core/Entity/Council_Entity_Document.gen';

import type {memberId as Council_Entity_Document_memberId} from '../../../src/core/Entity/Council_Entity_Document.gen';

import type {sectionId as Council_Entity_Document_sectionId} from '../../../src/core/Entity/Council_Entity_Document.gen';

import type {t as Council_Entity_Document_t} from '../../../src/core/Entity/Council_Entity_Document.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Transition_t = (_1:Council_Entity_Document_t, _2:Council_Entity_Document_event) => 
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error };

export const create: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly data: Council_Entity_Document_data }) => [
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error }, Council_Entity_Document_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_DocumentBS.create, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : {tag:"Locked", value:result[0]._0._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : ArrayItem.TAG===1
    ? {tag:"SectionAdded", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"SectionDeleted", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"ResponsibilityAssigned", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const addSection: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly section: Council_Entity_Document_sectionId }) => [
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error }, Council_Entity_Document_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_DocumentBS.addSection, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.section);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : {tag:"Locked", value:result[0]._0._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : ArrayItem.TAG===1
    ? {tag:"SectionAdded", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"SectionDeleted", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"ResponsibilityAssigned", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const deleteSection: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly section: Council_Entity_Document_sectionId }) => [
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error }, Council_Entity_Document_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_DocumentBS.deleteSection, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.section);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : {tag:"Locked", value:result[0]._0._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : ArrayItem.TAG===1
    ? {tag:"SectionAdded", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"SectionDeleted", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"ResponsibilityAssigned", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const assignResponsibility: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly responsibility: Council_Entity_Document_memberId }) => [
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error }, Council_Entity_Document_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_DocumentBS.assignResponsibility, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.responsibility);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : {tag:"Locked", value:result[0]._0._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : ArrayItem.TAG===1
    ? {tag:"SectionAdded", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"SectionDeleted", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"ResponsibilityAssigned", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const modifyTags: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly tags: string[] }) => [
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error }, Council_Entity_Document_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_DocumentBS.modifyTags, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.tags);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : {tag:"Locked", value:result[0]._0._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : ArrayItem.TAG===1
    ? {tag:"SectionAdded", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"SectionDeleted", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"ResponsibilityAssigned", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};

export const lock: (t:Council_Entity_Document_t, _2:{ readonly date: Date_t; readonly by: Council_Entity_Document_memberId }) => [
    { tag: "Ok"; value: Council_Entity_Document_t }
  | { tag: "Error"; value: Council_Entity_Document_error }, Council_Entity_Document_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_DocumentBS.lock, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Free"
    ? {TAG: 0, _0:Arg1.state.value} as any
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.by);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Free", value:result[0]._0.state._0}
    : {tag:"Locked", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0._0}
    : {tag:"Locked", value:result[0]._0._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : ArrayItem.TAG===1
    ? {tag:"SectionAdded", value:ArrayItem}
    : ArrayItem.TAG===2
    ? {tag:"SectionDeleted", value:ArrayItem}
    : ArrayItem.TAG===3
    ? {tag:"ResponsibilityAssigned", value:ArrayItem}
    : ArrayItem.TAG===4
    ? {tag:"TagsModified", value:ArrayItem}
    : {tag:"Locked", value:ArrayItem}})]
};
