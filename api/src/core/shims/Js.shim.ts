export type Promise2_t<T> = Promise<T>;

export type Dict_t<T> = { [id: string]: T };

export type Exn_t = unknown;

export type Json_t =
  | string
  | boolean
  | number
  | null
  | { [key: string]: Json_t };
