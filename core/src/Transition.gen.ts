/* TypeScript file generated from Transition.res by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type t<s,ev,e> = (_1:s, _2:ev) => 
    { tag: "Ok"; value: s }
  | { tag: "Error"; value: e };
