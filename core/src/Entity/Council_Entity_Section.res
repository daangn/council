module Id = Council_Entity_Section_Id

module UserId = Council_Entity_User_Id

type data = {
  heading: string,
  body: string,
  tags: array<string>,
}

type state =
  | Free(data)
  | Locked({by: UserId.t, data: data})

type t = {
  id: Id.t,
  state: option<state>,
}

let make = (id, data) => {
  id,
  state: switch data {
  | Some(data) => Some(Free(data))
  | None => None
  },
}

type event =
  | Created({date: Js.Date.t, state: state})
  | HeadingModified({date: Js.Date.t, heading: string})
  | BodyModified({date: Js.Date.t, body: string})
  | TagsModified({date: Js.Date.t, tags: array<string>})
  | Locked({date: Js.Date.t, by: UserId.t})

type error =
  | Uninitialized(Id.t)
  | Locked(Id.t)

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({state})) =>
    Ok({
      id,
      state: Some(state),
    })
  | ({id, state: Some(Free(data))}, HeadingModified({heading})) =>
    Ok({
      id,
      state: Some(
        Free({
          ...data,
          heading,
        }),
      ),
    })

  | ({id, state: Some(Free(data))}, BodyModified({body})) =>
    Ok({
      id,
      state: Some(
        Free({
          ...data,
          body,
        }),
      ),
    })

  | ({id, state: Some(Free(data))}, TagsModified({tags})) =>
    Ok({
      id,
      state: Some(
        Free({
          ...data,
          tags,
        }),
      ),
    })
  | ({id, state: Some(Free(data))}, Locked({by})) =>
    Ok({
      id,
      state: Some(
        Locked({
          by,
          data,
        }),
      ),
    })
  | ({id, state: Some(Locked(_))}, _) => Error(Locked(id))
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

  let lock = (t, ~date, ~by) => {
    let event: event = Locked({date, by})
    (t->transition(event), [event])
  }
}
