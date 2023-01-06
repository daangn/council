type memberId = string
type organizationId = string

@genType
type id = string

@genType
type data = {
  name: string,
  email: string,
  authProviders: array<string>,
  admin: bool,
  approved: bool,
}

@genType
type state = data

@genType
type event =
  | Created({date: Date.t, auth: string, name: string, email: string})
  | SingupApproved({date: Date.t, by: option<memberId>})
  | AdminGranted({date: Date.t, by: option<memberId>})
  | AdminRevoked({date: Date.t, by: option<memberId>})

@genType
type error =
  | Uninitialized({id: id})
  | AlreadyInitialized({id: id})

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
  | ({_RE, id, seq, events, state: None}, Created({auth, name, email})) =>
    Ok({
      _RE,
      id,
      seq,
      events: Array.concat(events, [event]),
      state: Some({
        name,
        email,
        authProviders: [auth],
        approved: false,
        admin: false,
      }),
    })
  | ({_RE, id, seq, events, state: Some(state)}, SingupApproved(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: Array.concat(events, [event]),
      state: Some({
        ...state,
        approved: true,
      }),
    })
  | ({_RE, id, seq, events, state: Some(state)}, AdminGranted(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: Array.concat(events, [event]),
      state: Some({
        ...state,
        admin: true,
      }),
    })
  | ({_RE, id, seq, events, state: Some(state)}, AdminRevoked(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: Array.concat(events, [event]),
      state: Some({
        ...state,
        admin: false,
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
let create = (t, ~date, ~name, ~email, ~auth) => {
  let event = Created({
    date,
    name,
    email,
    auth,
  })
  logic->Logic.run(t, event)
}

@genType
let createAdmin = (t, ~date, ~name, ~email, ~auth) => {
  logic->Logic.runMany(
    t,
    [
      Created({
        date,
        auth,
        name,
        email,
      }),
      SingupApproved({date, by: None}),
      AdminGranted({date, by: None}),
    ],
  )
}

@genType
let approveSignup = (t, ~date, ~by) => {
  let event = SingupApproved({date, by})
  logic->Logic.run(t, event)
}
