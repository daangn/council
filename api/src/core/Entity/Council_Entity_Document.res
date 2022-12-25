@genType
type id = string

@genType
type sectionId = string

@genType
type memberId = string

@genType
type data = {
  title: string,
  sections: array<sectionId>,
  tags: array<string>,
  owner: memberId,
  responsibility: memberId,
}

@genType
type state =
  | Free(data)
  | Locked({by: memberId, data: data})

@genType
type t = {
  _RE: [#Document],
  id: id,
  seq: int,
  state: option<state>,
}

@genType
type event =
  | Created({date: Date.t, data: data})
  | SectionAdded({date: Date.t, section: sectionId})
  | SectionDeleted({date: Date.t, section: sectionId})
  | ResponsibilityAssigned({date: Date.t, responsibility: memberId})
  | TagsModified({date: Date.t, tags: array<string>})
  | Locked({date: Date.t, by: memberId})

@genType
type error =
  | Uninitialized(id)
  | Locked(id)

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Document,
  id,
  seq,
  state,
}

module Logic = Abstract.Logic.Make({
  type id = id
  type state = state
  type t = t
  type event = event
  type error = error
  let make = make
})

let logic: Logic.t = (t, event) =>
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

@genType
let create = (t, ~date, ~data) => {
  let event = Created({date, data})
  logic->Logic.run(t, event)
}

@genType
let addSection = (t, ~date, ~section) => {
  let event = SectionAdded({date, section})
  logic->Logic.run(t, event)
}

@genType
let deleteSection = (t, ~date, ~section) => {
  let event = SectionDeleted({date, section})
  logic->Logic.run(t, event)
}

@genType
let assignResponsibility = (t, ~date, ~responsibility) => {
  let event = ResponsibilityAssigned({date, responsibility})
  logic->Logic.run(t, event)
}

@genType
let modifyTags = (t, ~date, ~tags) => {
  let event = TagsModified({date, tags})
  logic->Logic.run(t, event)
}

@genType
let lock = (t, ~date, ~by) => {
  let event: event = Locked({date, by})
  logic->Logic.run(t, event)
}
