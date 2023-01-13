type memberId = string

@genType
type id = string

@genType
type data = {
  subject: string,
  issuedAt: Date.t,
  expiredAt: Date.t,
  userAgent: string,
}

@genType
type state =
  | Anonymous({suggestedName: option<string>, suggestedEmail: option<string>, data: data})
  | Member({member: memberId, data: data})

@genType
type event =
  | Created({
      date: Date.t,
      data: data,
      suggestedName: option<string>,
      suggestedEmail: option<string>,
    })
  | MemberConnected({date: Date.t, member: memberId})

@genType
type error =
  | Uninitialized({session: id})
  | AlreadyInitialized({session: id})
  | AlreadyConnected({session: id, member: memberId})

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
  | ({_RE, id, seq, events, state: None}, Created({data, suggestedName, suggestedEmail})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Anonymous({
          suggestedName,
          suggestedEmail,
          data,
        }),
      ),
    })
  | ({id: session, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({session: session}))
  | ({_RE, id, seq, events, state: Some(Anonymous({data}))}, MemberConnected({member})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(Member({member, data})),
    })
  | ({id: session, state: Some(Member({member}))}, MemberConnected(_)) =>
    Error(AlreadyConnected({session, member}))
  | ({id: session, state: None}, _) => Error(Uninitialized({session: session}))
  }
}

@genType
let restore = (id, events) => {
  let session = make(id, ~seq=events->Js.Array.length, ())
  logic->Logic.runMany(session, events)
}

@genType
let createAnonymous = (t, ~date, ~data, ~suggestedName, ~suggestedEmail) => {
  logic->Logic.run(t, Created({date, data, suggestedName, suggestedEmail}))
}

@genType
let createMember = (t, ~date, ~data, ~member) => {
  logic->Logic.runMany(
    t,
    [
      Created({date, data, suggestedName: None, suggestedEmail: None}),
      MemberConnected({date, member}),
    ],
  )
}

@genType
let connectMember = (t, ~date, ~member) => {
  logic->Logic.run(t, MemberConnected({date, member}))
}
