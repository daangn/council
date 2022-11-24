module Id = Council_Entity_Document_Id

module SectionId = Council_Entity_Section_Id
module UserId = Council_Entity_User_Id

type state = {
  title: string,
  sections: array<SectionId.t>,
  tags: array<string>,
  owner: UserId.t,
  responsibility: UserId.t,
}

type t = {
  id: Id.t,
  state: option<state>,
}

let make = (id: Id.t, state) => {
  id,
  state,
}

type event =
  | Created({date: Js.Date.t, state: state})
  | SectionAdded({date: Js.Date.t, section: SectionId.t})
  | SectionDeleted({date: Js.Date.t, section: SectionId.t})
  | ResponsibilityAssigned({date: Js.Date.t, responsibility: UserId.t})
  | TagsModified({date: Js.Date.t, tags: array<string>})

type error = Uninitialized(Id.t)

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id}, Created({state})) =>
    Ok({
      id,
      state: Some(state),
    })
  | ({id, state: Some(state)}, SectionAdded({section})) =>
    Ok({
      id,
      state: Some({
        ...state,
        sections: state.sections->Belt.Array.concat([section]),
      }),
    })
  | ({id, state: Some(state)}, SectionDeleted({section: deleted})) =>
    Ok({
      id,
      state: Some({
        ...state,
        sections: state.sections->Belt.Array.keep(id => id != deleted),
      }),
    })
  | ({id, state: Some(state)}, ResponsibilityAssigned({responsibility})) =>
    Ok({
      id,
      state: Some({
        ...state,
        responsibility,
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
