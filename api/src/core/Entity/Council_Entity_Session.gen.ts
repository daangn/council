/* TypeScript file generated from Council_Entity_Session.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_SessionBS = require('./Council_Entity_Session.bs');

import type {t as Council_Entity_Section_Id_t} from './Council_Entity_Section_Id.gen';

import type {t as Council_Entity_User_Id_t} from './Council_Entity_User_Id.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly subject: string; 
  readonly issuedAt: Date_t; 
  readonly expiredAt: Date_t; 
  readonly userAgent: string
};

// tslint:disable-next-line:interface-over-type-literal
export type state = 
    { tag: "User"; value: { readonly user: Council_Entity_User_Id_t; readonly data: data } }
  | { tag: "Anonymous"; value: { readonly data: data } };

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly id: Council_Entity_Section_Id_t; readonly state?: state };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    { tag: "Uninitialized"; value: { readonly id: Council_Entity_Section_Id_t } }
  | { tag: "AlreadyInitialized"; value: { readonly id: Council_Entity_Section_Id_t } }
  | { tag: "AlreadyConnected"; value: {
  readonly id: Council_Entity_Section_Id_t; 
  readonly exist: Council_Entity_User_Id_t; 
  readonly newed: Council_Entity_User_Id_t
} };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { tag: "Created"; value: { readonly date: Date_t; readonly data: data } }
  | { tag: "UserConnected"; value: { readonly date: Date_t; readonly user: Council_Entity_User_Id_t } };

export const make: (id:Council_Entity_Section_Id_t, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_SessionBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return {id:result.id, state:(result.state == null ? result.state : result.state.TAG===0
    ? {tag:"User", value:result.state}
    : {tag:"Anonymous", value:result.state})}
};

export const restore: (t:t, events:event[]) => 
    { tag: "Ok"; value: t }
  | { tag: "Error"; value: error } = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_SessionBS.restore, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="User"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.map(function _element(ArrayItem: any) { return ArrayItem.tag==="Created"
    ? Object.assign({TAG: 0}, ArrayItem.value)
    : Object.assign({TAG: 1}, ArrayItem.value)}));
  return result.TAG===0
    ? {tag:"Ok", value:{id:result._0.id, state:(result._0.state == null ? result._0.state : result._0.state.TAG===0
    ? {tag:"User", value:result._0.state}
    : {tag:"Anonymous", value:result._0.state})}}
    : {tag:"Error", value:result._0.TAG===0
    ? {tag:"Uninitialized", value:result._0}
    : result._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result._0}
    : {tag:"AlreadyConnected", value:result._0}}
};

export const Command_create: (t:t, _2:{ readonly date: Date_t; readonly data: data }) => [
    { tag: "Ok"; value: t }
  | { tag: "Error"; value: error }, event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_SessionBS.Command.create, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="User"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"User", value:result[0]._0.state}
    : {tag:"Anonymous", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0}
    : result[0]._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result[0]._0}
    : {tag:"AlreadyConnected", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"UserConnected", value:ArrayItem}})]
};

export const Command_createWithUser: (t:t, _2:{
  readonly date: Date_t; 
  readonly data: data; 
  readonly user: Council_Entity_User_Id_t
}) => [
    { tag: "Ok"; value: t }
  | { tag: "Error"; value: error }, event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._4(Council_Entity_SessionBS.Command.createWithUser, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="User"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.data, Arg2.user);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"User", value:result[0]._0.state}
    : {tag:"Anonymous", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0}
    : result[0]._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result[0]._0}
    : {tag:"AlreadyConnected", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"UserConnected", value:ArrayItem}})]
};

export const Command_connectUser: (t:t, _2:{ readonly date: Date_t; readonly user: Council_Entity_User_Id_t }) => [
    { tag: "Ok"; value: t }
  | { tag: "Error"; value: error }, event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_SessionBS.Command.connectUser, {id:Arg1.id, state:(Arg1.state == null ? undefined : Arg1.state.tag==="User"
    ? Object.assign({TAG: 0}, Arg1.state.value)
    : Object.assign({TAG: 1}, Arg1.state.value))}, Arg2.date, Arg2.user);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{id:result[0]._0.id, state:(result[0]._0.state == null ? result[0]._0.state : result[0]._0.state.TAG===0
    ? {tag:"User", value:result[0]._0.state}
    : {tag:"Anonymous", value:result[0]._0.state})}}
    : {tag:"Error", value:result[0]._0.TAG===0
    ? {tag:"Uninitialized", value:result[0]._0}
    : result[0]._0.TAG===1
    ? {tag:"AlreadyInitialized", value:result[0]._0}
    : {tag:"AlreadyConnected", value:result[0]._0}}, result[1].map(function _element(ArrayItem: any) { return ArrayItem.TAG===0
    ? {tag:"Created", value:ArrayItem}
    : {tag:"UserConnected", value:ArrayItem}})]
};
