@genType
type id = string

@genType
type memberId = string

@genType
type data = {
  subject: string,
  issuedAt: Date.t,
  expiredAt: Date.t,
  userAgent: string,
}

@genType
type state =
  | Member({member: memberId, data: data})
  | Anonymous({data: data})

@genType
type event =
  | Created({date: Date.t, data: data})
  | MemberConnected({date: Date.t, member: memberId})

@genType
type error =
  | Invariant
  | IOError({id: id, exn: Js.Exn.t})
  | Uninitialized({id: id})
  | AlreadyInitialized({id: id})
  | AlreadyConnected({id: id, exist: memberId, newed: memberId})

@genType
type t = {
  _RE: [#Session],
  id: id,
  seq: int,
  events: array<event>,
  state: option<state>,
}

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Session,
  id,
  seq,
  events: [],
  state: state,
}
