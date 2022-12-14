@genType
type id = string

@genType
type memberId = string

@genType
type data = {
  name: string,
  owner: memberId,
  members: array<memberId>,
}

@genType
type t = {
  _RE: [#Organization],
  id: id,
  seq: int,
  data: option<data>,
}

@genType
type event =
  | Created({date: Date.t, owner: memberId})
  | MemberAdded({date: Date.t, actor: memberId, member: memberId})

@genType
let make = (id, data) => {
  _RE: #Organization,
  id,
  seq: 0,
  data,
}
