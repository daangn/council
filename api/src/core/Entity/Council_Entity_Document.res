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
