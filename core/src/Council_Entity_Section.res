module Id = Id.Make({
  type t
})

type data = {
  heading: string,
  body: string,
  tags: array<string>,
}

type t = {
  id: Id.t,
  data: option<data>,
}

let make = (id, data) => {
  id,
  data,
}

type event =
  | Created({date: Js.Date.t, data: data})
  | HeadingModified({date: Js.Date.t, heading: string})
  | BodyModified({date: Js.Date.t, body: string})
  | TagsModified({date: Js.Date.t, tags: array<string>})

type error = Uninitialized(Id.t)

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({data})) =>
    Ok({
      id,
      data: Some(data),
    })
  | ({id, data: Some(data)}, HeadingModified({heading})) =>
    Ok({
      id,
      data: Some({
        ...data,
        heading,
      }),
    })

  | ({id, data: Some(data)}, BodyModified({body})) =>
    Ok({
      id,
      data: Some({
        ...data,
        body,
      }),
    })

  | ({id, data: Some(data)}, TagsModified({tags})) =>
    Ok({
      id,
      data: Some({
        ...data,
        tags,
      }),
    })

  | ({id, data: None}, _) => Error(Uninitialized(id))
  }

module Command = {
  let create = (t, ~date, ~data) => {
    let event = Created({date, data})
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
