module Id = Council_Entity_Organization_Id

module MemberId = Council_Entity_Member_Id

@genType
type id = Id.t

@genType
type data = {
  name: string,
  owner: MemberId.t,
  members: array<MemberId.t>,
}

@genType
type t = {
  id: id,
  data: option<data>,
}

@genType
type event =
  | Created({date: Date.t, owner: MemberId.t})
  | MemberAdded({date: Date.t, actor: MemberId.t, member: MemberId.t})

@genType
let make = (id, data) => {
  id,
  data,
}
