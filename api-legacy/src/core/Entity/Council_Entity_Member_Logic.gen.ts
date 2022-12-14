/* TypeScript file generated from Council_Entity_Member_Logic.res by genType. */
/* eslint-disable import/first */


const $$toJS97415009: { [key: string]: any } = {"0": "Invariant"};

// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Entity_Member_LogicBS = require('./Council_Entity_Member_Logic.bs');

import type {data as Council_Entity_Member_data} from './Council_Entity_Member.gen';

import type {error as Council_Entity_Member_error} from './Council_Entity_Member.gen';

import type {event as Council_Entity_Member_event} from './Council_Entity_Member.gen';

import type {t as Council_Entity_Member_t} from './Council_Entity_Member.gen';

import type {t as Date_t} from '../../../src/core/Date.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Transition_t = (_1:Council_Entity_Member_t, _2:Council_Entity_Member_event) => 
    { tag: "Ok"; value: Council_Entity_Member_t }
  | { tag: "Error"; value: Council_Entity_Member_error };

export const create: (t:Council_Entity_Member_t, _2:{ readonly date: Date_t; readonly data: Council_Entity_Member_data }) => [
    { tag: "Ok"; value: Council_Entity_Member_t }
  | { tag: "Error"; value: Council_Entity_Member_error }, Council_Entity_Member_event[]] = function (Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Entity_Member_LogicBS.create, {_RE:Arg1._RE, id:Arg1.id, seq:Arg1.seq, events:Arg1.events.map(function _element(ArrayItem: any) { return ArrayItem.tag==="Created"
    ? Object.assign({TAG: 0}, ArrayItem.value)
    : Object.assign({TAG: 1}, ArrayItem.value)}), state:Arg1.state}, Arg2.date, Arg2.data);
  return [result[0].TAG===0
    ? {tag:"Ok", value:{_RE:result[0]._0._RE, id:result[0]._0.id, seq:result[0]._0.seq, events:result[0]._0.events.map(function _element(ArrayItem1: any) { return ArrayItem1.TAG===0
    ? {tag:"Created", value:ArrayItem1}
    : {tag:"DO_NOT_USE", value:ArrayItem1}}), state:result[0]._0.state}}
    : {tag:"Error", value:typeof(result[0]._0) === 'object'
    ? result[0]._0
    : $$toJS97415009[result[0]._0]}, result[1].map(function _element(ArrayItem2: any) { return ArrayItem2.TAG===0
    ? {tag:"Created", value:ArrayItem2}
    : {tag:"DO_NOT_USE", value:ArrayItem2}})]
};
