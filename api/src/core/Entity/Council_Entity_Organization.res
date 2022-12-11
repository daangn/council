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
  id: id,
  data: option<data>,
}

@genType
type event =
  | Created({date: Date.t, owner: memberId})
  | MemberAdded({date: Date.t, actor: memberId, member: memberId})

@genType
let make = (id, data) => {
  id,
  data,
}
