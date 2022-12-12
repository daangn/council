/* TypeScript file generated from Council_Domain.res by genType. */
/* eslint-disable import/first */


import type {Promise2_t as Js_Promise2_t} from '../../src/core/shims/Js.shim';

import type {t as Council_Entity_Member_t} from '../../src/core/Entity/Council_Entity_Member.gen';

import type {t as Council_Entity_Session_t} from '../../src/core/Entity/Council_Entity_Session.gen';

// tslint:disable-next-line:interface-over-type-literal
export type aggregate = 
    { tag: "Session"; value: Council_Entity_Session_t }
  | { tag: "Member"; value: Council_Entity_Member_t };

// tslint:disable-next-line:interface-over-type-literal
export type eventStore = { readonly persist: (_1:aggregate) => Js_Promise2_t<aggregate> };
