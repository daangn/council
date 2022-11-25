module Id = Council_Entity_Section_Id

module UserId = Council_Entity_User_Id

type data = {
  heading: string,
  body: string,
  tags: array<string>,
}

type state =
  | Free(data)
  | Editing({by: UserId.t, data: data})
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
  | EditingStarted({date: Js.Date.t, by: UserId.t})
  | EditingEnded({date: Js.Date.t, by: UserId.t})
  | HeadingModified({date: Js.Date.t, heading: string, by: UserId.t})
  | BodyModified({date: Js.Date.t, body: string, by: UserId.t})
  | TagsModified({date: Js.Date.t, tags: array<string>, by: UserId.t})
  | Locked({date: Js.Date.t, by: UserId.t})

type error =
  | Uninitialized(Id.t)
  | Locked({id: Id.t, by: UserId.t})
  | Editing({id: Id.t, by: UserId.t})

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({state})) =>
    Ok({
      id,
      state: Some(state),
    })

  | ({id, state: Some(Free(data))}, EditingStarted({by})) =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data,
        }),
      ),
    })

  | ({id, state: Some(Free(data))}, EditingEnded(_)) =>
    Ok({
      id,
      state: Some(Free(data)),
    })

  | ({id, state: Some(Free(data))}, HeadingModified({heading, by})) =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            heading,
          },
        }),
      ),
    })

  | ({id, state: Some(Editing({data, by: editBy}))}, HeadingModified({heading, by}))
    if editBy == by =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            heading,
          },
        }),
      ),
    })

  | ({id, state: Some(Free(data))}, BodyModified({body, by})) =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            body,
          }
        })
      )
    })

  | ({id, state: Some(Editing({data, by: editBy}))}, BodyModified({body, by})) if editBy == by =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            body,
          },
        }),
      ),
    })

  | ({id, state: Some(Free(data))}, TagsModified({tags, by})) =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            tags,
          }
        })
      )
    })

  | ({id, state: Some(Editing({data, by: editBy}))}, TagsModified({tags, by})) if editBy == by =>
    Ok({
      id,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            tags,
          },
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

  | ({id, state: Some(Editing({data, by: editBy}))}, Locked({by: lockBy})) if editBy == lockBy =>
    Ok({
      id,
      state: Some(
        Locked({
          by: lockBy,
          data,
        }),
      ),
    })

  | ({id, state: Some(Editing({data, by: editBy}))}, EditingEnded({by})) if editBy == by =>
    Ok({
      id,
      state: Some(Free(data)),
    })

  | ({id, state: Some(Editing({by}))}, EditingEnded(_) | Locked(_)) => Error(Editing({id, by}))

  | (
      {id, state: Some(Editing({by}))},
      EditingStarted(_) | HeadingModified(_) | BodyModified(_) | TagsModified(_),
    ) =>
    Error(Editing({id, by}))

  | ({id, state: Some(Locked({by}))}, _) => Error(Locked({id, by}))

  | ({id, state: None}, _) => Error(Uninitialized(id))
  }

module Command = {
  let create = (t, ~date, ~state) => {
    let event = Created({date, state})
    (t->transition(event), [event])
  }

  let modifyHeading = (t, ~date, ~heading, ~by) => {
    let event = HeadingModified({date, heading, by})
    (t->transition(event), [event])
  }

  let modifyBody = (t, ~date, ~body, ~by) => {
    let event = BodyModified({date, body, by})
    (t->transition(event), [event])
  }

  let modifyTags = (t, ~date, ~tags, ~by) => {
    let event = TagsModified({date, tags, by})
    (t->transition(event), [event])
  }

  let lock = (t, ~date, ~by) => {
    let event: event = Locked({date, by})
    (t->transition(event), [event])
  }
}
