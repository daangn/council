/* TypeScript file generated from Council_Command_Member.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as Council_Command_MemberBS__Es6Import from './Council_Command_Member.bs';
const Council_Command_MemberBS: any = Council_Command_MemberBS__Es6Import;

import type {data as Council_Entity_Member_data} from '../../../src/core/Entity/Council_Entity_Member.gen';

import type {error as Council_Entity_Member_error} from '../../../src/core/Entity/Council_Entity_Member.gen';

import type {event as Council_Entity_Member_event} from '../../../src/core/Entity/Council_Entity_Member.gen';

import type {t as Council_Entity_Member_t} from '../../../src/core/Entity/Council_Entity_Member.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

export const create: (t:Council_Entity_Member_t, _2:{ readonly date: Date_t; readonly data: Council_Entity_Member_data }) => [
    { tag: "Ok"; value: Council_Entity_Member_t }
  | { tag: "Error"; value: Council_Entity_Member_error }, Council_Entity_Member_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Command_MemberBS.create, Arg1, Arg2.date, Arg2.data);
  return [result[0].TAG===0
    ? {tag:"Ok", value:result[0]._0}
    : {tag:"Error", value:result[0]._0}, result[1].map(function _element(ArrayItem: any) { return ArrayItem})]
};
