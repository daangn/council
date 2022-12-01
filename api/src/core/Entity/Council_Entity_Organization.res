module Id = Council_Entity_Organization_Id

module UserId = Council_Entity_User_Id

type data = {
  name: string,
  owner: UserId.t,
  members: array<UserId.t>,
}

type t = {
  id: Id.t,
  data: option<data>,
}

type event =
  | Created({date: Date.t, owner: UserId.t})
  | MemberAdded({date: Date.t, actor: UserId.t, member: UserId.t})

let make = (id, data) => {
  id,
  data,
}
