module Id = Council_Entity_User_Id

module OrganizationId = Council_Entity_Organization_Id

type data = {
  username: string,
  name: string,
  email: option<string>,
  authProviders: array<string>,
}

@genType
type t = {
  id: Id.t,
  data: option<data>,
}

type event = Created({date: Date.t, data: data})

let transition: Transition.t<t, event, unit> = (t, event) => {
  switch (t, event) {
  | ({id}, Created({data})) =>
    Ok({
      id,
      data: Some(data),
    })
  }
}

@genType
let make = (id, data) => {
  id,
  data,
}

module Command = {
  @genType
  let create = (t, ~date, ~data) => {
    let event = Created({date, data})
    (t->transition(event), [event])
  }
}
