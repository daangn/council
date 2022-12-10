module Id = Council_Entity_Section_Id

@genType
type id = Id.t

@genType
type memberId = Council_Entity_Member_Id.t

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
type t = {
  id: id,
  state: option<state>,
}

@genType
type event =
  | Created({date: Date.t, data: data})
  | MemberConnected({date: Date.t, member: memberId})

@genType
type error =
  | Uninitialized({id: id})
  | AlreadyInitialized({id: id})
  | AlreadyConnected({id: id, exist: memberId, newed: memberId})

@genType
let make = (id, data) => {
  id,
  state: switch data {
  | Some(data) => Some(Anonymous({data: data}))
  | None => None
  },
}
