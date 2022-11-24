module Id = Council_Entity_Section_Id

type state = {
  heading: string,
  body: string,
  tags: array<string>,
}

type t = {
  id: Id.t,
  state: option<state>,
}

let make = (id, state) => {
  id,
  state,
}

type event =
  | Created({date: Js.Date.t, state: state})
  | HeadingModified({date: Js.Date.t, heading: string})
  | BodyModified({date: Js.Date.t, body: string})
  | TagsModified({date: Js.Date.t, tags: array<string>})

type error = Uninitialized(Id.t)

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({state})) =>
    Ok({
      id,
      state: Some(state),
    })
  | ({id, state: Some(state)}, HeadingModified({heading})) =>
    Ok({
      id,
      state: Some({
        ...state,
        heading,
      }),
    })

  | ({id, state: Some(state)}, BodyModified({body})) =>
    Ok({
      id,
      state: Some({
        ...state,
        body,
      }),
    })

  | ({id, state: Some(state)}, TagsModified({tags})) =>
    Ok({
      id,
      state: Some({
        ...state,
        tags,
      }),
    })

  | ({id, state: None}, _) => Error(Uninitialized(id))
  }

module Command = {
  let create = (t, ~date, ~state) => {
    let event = Created({date, state})
    (t->transition(event), [event])
  }

  let modifyHeading = (t, ~date, ~heading) => {
    let event = HeadingModified({date, heading})
    (t->transition(event), [event])
  }

  let modifyBody = (t, ~date, ~body) => {
    let event = BodyModified({date, body})
    (t->transition(event), [event])
  }

  let modifyTags = (t, ~date, ~tags) => {
    let event = TagsModified({date, tags})
    (t->transition(event), [event])
  }
}
