module Section = Council_Entity_Section
module User = Council_Entity_User

module Id = Id.Make({
  type t
})

type data = {
  title: string,
  sections: array<Section.Id.t>,
  tags: array<string>,
  owner: User.Id.t,
  responsibility: User.Id.t,
}

type t = {
  id: Id.t,
  data: option<data>,
}

let make = (id: Id.t, data) => {
  id,
  data,
}

type event =
  | Created({date: Js.Date.t, data: data})
  | SectionAdded({date: Js.Date.t, section: Section.Id.t})
  | SectionDeleted({date: Js.Date.t, section: Section.Id.t})
  | ResponsibilityAssigned({date: Js.Date.t, responsibility: User.Id.t})
  | TagsModified({date: Js.Date.t, tags: array<string>})

type error = Uninitialized(Id.t)

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({data})) =>
    Ok({
      id,
      data: Some(data),
    })
  | ({id, data: Some(data)}, SectionAdded({section})) =>
    Ok({
      id,
      data: Some({
        ...data,
        sections: data.sections->Belt.Array.concat([section]),
      }),
    })
  | ({id, data: Some(data)}, SectionDeleted({section: deleted})) =>
    Ok({
      id,
      data: Some({
        ...data,
        sections: data.sections->Belt.Array.keep(id => id != deleted),
      }),
    })
  | ({id, data: Some(data)}, ResponsibilityAssigned({responsibility})) =>
    Ok({
      id,
      data: Some({
        ...data,
        responsibility,
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
  let addSection = (t, ~date, ~section) => {
    let event = SectionAdded({date, section})
    (t->transition(event), [event])
  }

  let deleteSection = (t, ~date, ~section) => {
    let event = SectionDeleted({date, section})
    (t->transition(event), [event])
  }

  let assignResponsibility = (t, ~date, ~responsibility) => {
    let event = ResponsibilityAssigned({date, responsibility})
    (t->transition(event), [event])
  }

  let modifyTags = (t, ~date, ~tags) => {
    let event = TagsModified({date, tags})
    (t->transition(event), [event])
  }
}
