type memberId = string

@genType
type id = string

@genType
type data = {
  title: string,
  tags: array<string>,
  owner: memberId,
}

@genType
type state = data

@genType
type event =
  | Created({date: Date.t, title: string, tags: array<string>, by: memberId})
  | TitleUpdated({date: Date.t, title: string})

@genType
type error =
  | Uninitialized({id: id})
  | AlreadyInitialized({id: id})

@genType
type t = {
  _RE: [#Document],
  id: id,
  seq: int,
  events: array<event>,
  state: option<state>,
}

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Document,
  id,
  seq,
  events: [],
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

let logic: Logic.t = (t, event) => {
  open Belt
  switch (t, event) {
  | ({_RE, id, seq, events, state: None}, Created({title, tags, by})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some({title, tags, owner: by}),
    })
  | ({_RE, id, seq, events, state: Some(data)}, TitleUpdated({title: newTitle})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some({
        ...data,
        title: newTitle,
      }),
    })
  | ({id, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({id: id}))
  | ({id, state: None}, _) => Error(Uninitialized({id: id}))
  }
}

@genType
let restore = (id, events) => {
  let member = make(id, ~seq=events->Js.Array.length, ())
  logic->Logic.runMany(member, events)
}

@genType
let create = (t, ~date, ~title, ~tags=[], ~by) => {
  let event = Created({
    date,
    title,
    tags,
    by,
  })
  logic->Logic.run(t, event)
}
