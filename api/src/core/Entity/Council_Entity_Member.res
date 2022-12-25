type organizationId = string

@genType
type id = string

@genType
type data = {
  username: string,
  name: string,
  email: option<string>,
  authProviders: array<string>,
}

@genType
type state = data

@genType
type event = Created({date: Date.t, data: data})

@genType
type error = unit

@genType
type t = {
  _RE: [#Member],
  id: id,
  seq: int,
  events: array<event>,
  state: option<state>,
}

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Member,
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
  | ({_RE, id, seq, events}, Created({data})) =>
    Ok({
      _RE,
      id,
      seq,
      events: Array.concat(events, [event]),
      state: Some(data),
    })
  }
}

@genType
let restore = (id, events) => {
  let member = make(id, ~seq=events->Js.Array.length, ())
  logic->Logic.runMany(member, events)
}

@genType
let create = (t, ~date, ~data) => {
  let event = Created({date, data})
  logic->Logic.run(t, event)
}
