module Document = Council_Entity_Document

module Transition = Framework.Transition.Make(Document)

let transition: Transition.t = (t, event) =>
  switch (t, event) {
  | ({_RE, id, seq}, Created({data})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(Free(data)),
    })
  | ({_RE, id, seq, state: Some(Free(data))}, SectionAdded({section})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Free({
          ...data,
          sections: data.sections->Belt.Array.concat([section]),
        }),
      ),
    })
  | ({_RE, id, seq, state: Some(Free(data))}, SectionDeleted({section: deleted})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Free({
          ...data,
          sections: data.sections->Belt.Array.keep(id => id != deleted),
        }),
      ),
    })
  | ({_RE, id, seq, state: Some(Free(data))}, ResponsibilityAssigned({responsibility})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Free({
          ...data,
          responsibility,
        }),
      ),
    })
  | ({_RE, id, seq, state: Some(Free(data))}, TagsModified({tags})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Free({
          ...data,
          tags,
        }),
      ),
    })
  | ({_RE, id, seq, state: Some(Free(data))}, Locked({by})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
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

open Document

@genType
let create = (t, ~date, ~data) => {
  let event = Created({date, data})
  transition->Transition.run(t, event)
}

@genType
let addSection = (t, ~date, ~section) => {
  let event = SectionAdded({date, section})
  transition->Transition.run(t, event)
}

@genType
let deleteSection = (t, ~date, ~section) => {
  let event = SectionDeleted({date, section})
  transition->Transition.run(t, event)
}

@genType
let assignResponsibility = (t, ~date, ~responsibility) => {
  let event = ResponsibilityAssigned({date, responsibility})
  transition->Transition.run(t, event)
}

@genType
let modifyTags = (t, ~date, ~tags) => {
  let event = TagsModified({date, tags})
  transition->Transition.run(t, event)
}

@genType
let lock = (t, ~date, ~by) => {
  let event: event = Locked({date, by})
  transition->Transition.run(t, event)
}
