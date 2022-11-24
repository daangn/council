module Id = Council_Entity_User_Id

module OrganizationId = Council_Entity_Organization_Id

type data = {
  username: string,
  email: string,
  org: OrganizationId.t,
}

type t = {
  id: Id.t,
  data: option<data>,
}

let make = (id, data) => {
  id,
  data,
}

type event = Created({date: Js.Date.t, data: data})

let transition: Transition.t<t, event, unit> = (t, event) => {
  switch (t, event) {
  | ({id}, Created({data})) =>
    Ok({
      id,
      data: Some(data),
    })
  }
}

module Command = {
  let create = (t, ~date, ~data) => {
    let event = Created({date, data})
    (t->transition(event), [event])
  }
}
