module Id = Council_Entity_User_Id

module OrganizationId = Council_Entity_Organization_Id

type state = {
  username: string,
  email: string,
  org: OrganizationId.t,
}

type t = {
  id: Id.t,
  state: option<state>,
}

let make = (id, state) => {
  id,
  state,
}

type event = Created({date: Js.Date.t, state: state})

let transition: Transition.t<t, event, unit> = (t, event) => {
  switch (t, event) {
  | ({id}, Created({state})) =>
    Ok({
      id,
      state: Some(state),
    })
  }
}

module Command = {
  let create = (t, ~date, ~state) => {
    let event = Created({date, state})
    (t->transition(event), [event])
  }
}
