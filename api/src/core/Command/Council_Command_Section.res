module Section = Council_Entity_Section

module Transition = Framework.Transition.Make(Section)

let transition: Transition.t = (t, event) =>
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
          },
        }),
      ),
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
          },
        }),
      ),
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

open Section

@genType
let create = (t, ~date, ~state) => {
  let event = Created({date, state})
  (t->transition(event), [event])
}

@genType
let modifyHeading = (t, ~date, ~heading, ~by) => {
  let event = HeadingModified({date, heading, by})
  (t->transition(event), [event])
}

@genType
let modifyBody = (t, ~date, ~body, ~by) => {
  let event = BodyModified({date, body, by})
  (t->transition(event), [event])
}

@genType
let modifyTags = (t, ~date, ~tags, ~by) => {
  let event = TagsModified({date, tags, by})
  (t->transition(event), [event])
}

@genType
let lock = (t, ~date, ~by) => {
  let event: event = Locked({date, by})
  (t->transition(event), [event])
}
