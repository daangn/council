module Id = Council_Entity_Organization_Id

module User = Council_Entity_User

type t = {
  id: Id.t,
  name: string,
  members: array<User.Id.t>,
}
