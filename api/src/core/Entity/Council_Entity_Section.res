module Id = Council_Entity_Section_Id

@genType
type id = Id.t

@genType
type memberId = Council_Entity_Member_Id.t

@genType
type data = {
  heading: string,
  body: string,
  tags: array<string>,
}

@genType
type state =
  | Free(data)
  | Editing({by: memberId, data: data})
  | Locked({by: memberId, data: data})

@genType
type t = {
  id: id,
  state: option<state>,
}

@genType
type event =
  | Created({date: Date.t, state: state})
  | EditingStarted({date: Date.t, by: memberId})
  | EditingEnded({date: Date.t, by: memberId})
  | HeadingModified({date: Date.t, heading: string, by: memberId})
  | BodyModified({date: Date.t, body: string, by: memberId})
  | TagsModified({date: Date.t, tags: array<string>, by: memberId})
  | Locked({date: Date.t, by: memberId})

@genType
type error =
  | Uninitialized(id)
  | Locked({id: id, by: memberId})
  | Editing({id: id, by: memberId})

@genType
let make = (id, data) => {
  id,
  state: switch data {
  | Some(data) => Some(Free(data))
  | None => None
  },
}
