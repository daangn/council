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
  | ({_RE, id, seq}, Created({state})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(state),
    })

  | ({_RE, id, seq, state: Some(Free(data))}, EditingStarted({by})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Editing({
          by,
          data,
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Free(data))}, EditingEnded(_)) =>
    Ok({
      _RE,
      id,
      seq,
      state: Some(Free(data)),
    })

  | ({_RE, id, seq, state: Some(Free(data))}, HeadingModified({heading, by})) =>
    Ok({
      _RE,
      id,
      seq,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            heading,
          },
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Editing({data, by: editBy}))}, HeadingModified({heading, by}))
    if editBy == by =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            heading,
          },
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Free(data))}, BodyModified({body, by})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            body,
          },
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Editing({data, by: editBy}))}, BodyModified({body, by}))
    if editBy == by =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            body,
          },
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Free(data))}, TagsModified({tags, by})) =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            tags,
          },
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Editing({data, by: editBy}))}, TagsModified({tags, by}))
    if editBy == by =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Editing({
          by,
          data: {
            ...data,
            tags,
          },
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

  | ({_RE, id, seq, state: Some(Editing({data, by: editBy}))}, Locked({by: lockBy}))
    if editBy == lockBy =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(
        Locked({
          by: lockBy,
          data,
        }),
      ),
    })

  | ({_RE, id, seq, state: Some(Editing({data, by: editBy}))}, EditingEnded({by}))
    if editBy == by =>
    Ok({
      _RE,
      id,
      seq: seq + 1,
      state: Some(Free(data)),
    })

  | ({id, state: Some(Editing({by}))}, EditingEnded(_) | Locked(_)) => Error(Editing({id, by}))

  | (
      {id, state: Some(Editing({by}))},
      EditingStarted(_) | HeadingModified(_) | BodyModified(_) | TagsModified(_),
    ) =>
    Error(Editing({id, by}))

  | ({id, state: Some(Locked({by}))}, _) => Error(Locked({id, by}))

  | ({id, state: None}, _) => Error(Uninitialized(id))
  }

@genType
let create = (t, ~date, ~state) => {
  let event = Created({date, state})
  logic->Logic.run(t, event)
}

@genType
let modifyHeading = (t, ~date, ~heading, ~by) => {
  let event = HeadingModified({date, heading, by})
  logic->Logic.run(t, event)
}

@genType
let modifyBody = (t, ~date, ~body, ~by) => {
  let event = BodyModified({date, body, by})
  logic->Logic.run(t, event)
}

@genType
let modifyTags = (t, ~date, ~tags, ~by) => {
  let event = TagsModified({date, tags, by})
  logic->Logic.run(t, event)
}

@genType
let lock = (t, ~date, ~by) => {
  let event: event = Locked({date, by})
  logic->Logic.run(t, event)
}
