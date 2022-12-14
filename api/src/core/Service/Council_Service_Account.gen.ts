/* TypeScript file generated from Council_Service_Account.res by genType. */
/* eslint-disable import/first */


const $$toJS130381162: { [key: string]: any } = {"0": "IOError"};

// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Service_AccountBS = require('./Council_Service_Account.bs');

import type {t as Council_Repository_Member_t} from '../../../src/core/Repository/Council_Repository_Member.gen';

import type {t as Council_Repository_Session_t} from '../../../src/core/Repository/Council_Repository_Session.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly memberRepo: Council_Repository_Member_t; readonly sessionRepo: Council_Repository_Session_t };

// tslint:disable-next-line:interface-over-type-literal
export type error = 
    "IOError"
  | { readonly name: boolean; readonly email: boolean };

export const make: (_1:{ readonly memberRepo: Council_Repository_Member_t; readonly sessionRepo: Council_Repository_Session_t }) => t = function (Arg1: any) {
  const result = Curry._2(Council_Service_AccountBS.make, Arg1.memberRepo, Arg1.sessionRepo);
  return result
};

export const validateSignup: <T1>(t:T1, _2:{ readonly name: string; readonly email: string }) => 
    { tag: "Ok"; value: void }
  | { tag: "Error"; value: error } = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._3(Council_Service_AccountBS.validateSignup, Arg1, Arg2.name, Arg2.email);
  return result.TAG===0
    ? {tag:"Ok", value:result._0}
    : {tag:"Error", value:typeof(result._0) === 'object'
    ? result._0
    : $$toJS130381162[result._0]}
};
