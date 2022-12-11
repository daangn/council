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
  id: id,
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
let make = (id, data) => {
  id,
  state: switch data {
  | Some(data) => Some(Free(data))
  | None => None
  },
}
