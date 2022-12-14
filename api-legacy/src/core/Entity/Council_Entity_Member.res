@genType
type id = string

@genType
type organizationId = string

@genType
type data = {
  username: string,
  name: string,
  email: option<string>,
  authProviders: array<string>,
}

@genType
type state = data

@genType
type event =
  | Created({date: Date.t, data: data})
  | DO_NOT_USE({date: Date.t})

@genType
type error =
  | Invariant
  | IOError({id: id, exn: Js.Exn.t})

@genType
type t = {
  _RE: [#Member],
  id: id,
  seq: int,
  events: array<event>,
  state: option<state>,
}

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Member,
  id,
  seq,
  events: [],
  state,
}
