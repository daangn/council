/* TypeScript file generated from Council_Entity_User.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_UserBS = require('./Council_Entity_User.bs');

import type {t as Council_Entity_User_Id_t} from './Council_Entity_User_Id.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type data = {
  readonly username: string; 
  readonly name: string; 
  readonly email?: string; 
  readonly authProviders: string[]
};

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly id: Council_Entity_User_Id_t; readonly data?: data };

// tslint:disable-next-line:interface-over-type-literal
export type event = 
    { readonly date: Date_t; readonly data: data };

export const make: (id:Council_Entity_User_Id_t, data:(null | undefined | data)) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Council_Entity_UserBS.make, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Command_create: (t:t, _2:{ readonly date: Date_t; readonly data: data }) => [
    { tag: "Ok"; value: t }
  | { tag: "Error"; value: void }, event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_UserBS.Command.create, Arg1, Arg2.date, Arg2.data);
  return [result[0].TAG===0
    ? {tag:"Ok", value:result[0]._0}
    : {tag:"Error", value:result[0]._0}, result[1].map(function _element(ArrayItem: any) { return ArrayItem})]
};
