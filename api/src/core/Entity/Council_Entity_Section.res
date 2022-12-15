@genType
type id = string

@genType
type memberId = string

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
  _RE: [#Section],
  id: id,
  seq: int,
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
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Section,
  id,
  seq,
  state,
}
