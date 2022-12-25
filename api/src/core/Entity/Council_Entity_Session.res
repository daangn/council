type memberId = string

@genType
type id = string

@genType
type data = {
  subject: string,
  issuedAt: Date.t,
  expiredAt: Date.t,
  userAgent: string,
  suggestedName: option<string>,
  suggestedEmail: option<string>,
  verifiedEmail: option<string>,
}

@genType
type state = data

@genType
type event = Created({date: Date.t, data: data})

@genType
type error =
  | Uninitialized({session: id})
  | AlreadyInitialized({session: id})

@genType
type t = {
  _RE: [#Session],
  id: id,
  seq: int,
  events: array<event>,
  state: option<state>,
}

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Session,
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
  | ({_RE, id, seq, events, state: None}, Created({data})) =>
    Ok({
      _RE,
      id,
      seq,
      events: Array.concat(events, [event]),
      state: Some(data),
    })
  | ({id: session, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({session: session}))
  }
}

@genType
let restore = (id, events) => {
  let session = make(id, ~seq=events->Js.Array.length, ())
  logic->Logic.runMany(session, events)
}

@genType
let create = (t, ~date, ~data) => {
  logic->Logic.run(t, Created({date, data}))
}
