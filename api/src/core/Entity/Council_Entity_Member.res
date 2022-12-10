module Id = Council_Entity_Member_Id

module OrganizationId = Council_Entity_Organization_Id

@genType
type id = Id.t

@genType
type data = {
  username: string,
  name: string,
  email: option<string>,
  authProviders: array<string>,
}

@genType
type t = {
  id: id,
  data: option<data>,
}

@genType
type event = Created({date: Date.t, data: data})

@genType
type error = unit

@genType
let make = (id, data) => {
  id,
  data,
}
