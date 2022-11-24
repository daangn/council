module Id = Council_Entity_Document_Id

module SectionId = Council_Entity_Section_Id
module UserId = Council_Entity_User_Id

type data = {
  title: string,
  sections: array<SectionId.t>,
  tags: array<string>,
  owner: UserId.t,
  responsibility: UserId.t,
}

type state =
  | Free(data)
  | Locked({by: UserId.t, data: data})

type t = {
  id: Id.t,
  state: option<state>,
}

let make = (id: Id.t, data) => {
  id,
  state: switch data {
  | Some(data) => Some(Free(data))
  | None => None
  },
}

type event =
  | Created({date: Js.Date.t, data: data})
  | SectionAdded({date: Js.Date.t, section: SectionId.t})
  | SectionDeleted({date: Js.Date.t, section: SectionId.t})
  | ResponsibilityAssigned({date: Js.Date.t, responsibility: UserId.t})
  | TagsModified({date: Js.Date.t, tags: array<string>})
  | Locked({date: Js.Date.t, by: UserId.t})

type error =
  | Uninitialized(Id.t)
  | Locked(Id.t)

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({data})) =>
    Ok({
      id,
      state: Some(Free(data)),
    })
  | ({id, state: Some(Free(data))}, SectionAdded({section})) =>
    Ok({
      id,
      state: Some(
        Free({
          ...data,
          sections: data.sections->Belt.Array.concat([section]),
        }),
      ),
    })
  | ({id, state: Some(Free(data))}, SectionDeleted({section: deleted})) =>
    Ok({
      id,
      state: Some(
        Free({
          ...data,
          sections: data.sections->Belt.Array.keep(id => id != deleted),
        }),
      ),
    })
  | ({id, state: Some(Free(data))}, ResponsibilityAssigned({responsibility})) =>
    Ok({
      id,
      state: Some(
        Free({
          ...data,
          responsibility,
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
  | ({id, state: None}, _) => Error(Uninitialized(id))
  | ({id, state: Some(Locked(_))}, _) => Error(Locked(id))
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

  let lock = (t, ~date, ~by) => {
    let event: event = Locked({date, by})
    (t->transition(event), [event])
  }
}
