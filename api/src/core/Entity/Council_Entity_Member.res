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
