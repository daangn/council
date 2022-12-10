/* TypeScript file generated from Council_Command_Session.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Command_SessionBS__Es6Import from './Council_Command_Session.bs';
const Council_Command_SessionBS: any = Council_Command_SessionBS__Es6Import;

import type {data as Council_Entity_Session_data} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {error as Council_Entity_Session_error} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {event as Council_Entity_Session_event} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {memberId as Council_Entity_Session_memberId} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {t as Council_Entity_Session_t} from '../../../src/core/Entity/Council_Entity_Session.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

export const create: (t:Council_Entity_Session_t, _2:{ readonly date: Date_t; readonly data: Council_Entity_Session_data }) => [
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error }, Council_Entity_Session_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_SessionBS.create, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Member", value:result[0]._0.state}
    : {tag:"Anonymous", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0}
    : result[0]._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result[0]._0}
    : {tag:"AlreadyConnected", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"MemberConnected", value:ArrayItem}})]
};

export const createWithUser: (t:Council_Entity_Session_t, _2:{
  readonly date: Date_t; 
  readonly data: Council_Entity_Session_data; 
  readonly member: Council_Entity_Session_memberId
}) => [
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error }, Council_Entity_Session_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Command_SessionBS.createWithUser, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data, Arg2.member);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Member", value:result[0]._0.state}
    : {tag:"Anonymous", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0}
    : result[0]._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result[0]._0}
    : {tag:"AlreadyConnected", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"MemberConnected", value:ArrayItem}})]
};

export const connectUser: (t:Council_Entity_Session_t, _2:{ readonly date: Date_t; readonly member: Council_Entity_Session_memberId }) => [
    { tag: "Ok"; value: Council_Entity_Session_t }
  | { tag: "Error"; value: Council_Entity_Session_error }, Council_Entity_Session_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_SessionBS.connectUser, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="Member"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.member);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"Member", value:result[0]._0.state}
    : {tag:"Anonymous", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0}
    : result[0]._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result[0]._0}
    : {tag:"AlreadyConnected", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"MemberConnected", value:ArrayItem}})]
};
