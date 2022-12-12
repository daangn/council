/* TypeScript file generated from Council_Service_Account.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const Council_Service_AccountBS = require('./Council_Service_Account.bs');

import type {t as Council_Repository_Member_t} from '../../../src/core/Repository/Council_Repository_Member.gen';

import type {t as Council_Repository_Session_t} from '../../../src/core/Repository/Council_Repository_Session.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly memberRepo: Council_Repository_Member_t; readonly sessionRepo: Council_Repository_Session_t };

export const make: (_1:{ readonly memberRepo: Council_Repository_Member_t; readonly sessionRepo: Council_Repository_Session_t }) => t = function (Arg1: any) {
  const result = Curry._2(Council_Service_AccountBS.make, Arg1.memberRepo, Arg1.sessionRepo);
  return result
};
