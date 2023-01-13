@genType
type id = string

@genType
type memberId = string

@genType
type data = {
  name: string,
  label: string,
  owner: memberId,
  members: array<memberId>,
}

@genType
type state = data

@genType
type event =
  | Created({date: Date.t, by: memberId, name: string, label: string})
  | MemberAdded({date: Date.t, by: option<memberId>, member: memberId})
  | MemberRemoved({date: Date.t, by: option<memberId>, member: memberId})

@genType
type error =
  | Uninitialized({id: id})
  | AlreadyInitialized({id: id})
  | MemberAlreadyJoined({by: option<memberId>, member: memberId})
  | CannotRemoveOwner({by: option<memberId>, ownerMember: memberId})
  | CannotRemoveSelf({member: memberId})

@genType
type t = {
  _RE: [#Organization],
  id: id,
  seq: int,
  events: array<event>,
  state: option<state>,
}

@genType
let make = (id, ~state=?, ~seq=0, ()) => {
  _RE: #Organization,
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
  | ({_RE, id, seq, events, state: None}, Created({by, name, label})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some({
        name,
        label,
        owner: by,
        members: [by],
      }),
    })
  | ({id, state: None}, _) => Error(Uninitialized({id: id}))
  | ({id, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({id: id}))
  | ({state: Some(state)}, MemberAdded({by, member}))
    if state.members->Array.some(existing => existing == member) =>
    Error(MemberAlreadyJoined({by, member}))
  | ({_RE, id, seq, events, state: Some(state)}, MemberAdded({member})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some({
        ...state,
        members: state.members->Array.concat([member]),
      }),
    })
  | ({state: Some(state)}, MemberRemoved({by, member}))
    if state.members->Array.some(member => member == state.owner) =>
    Error(CannotRemoveOwner({by, ownerMember: member}))
  | ({state: Some(_)}, MemberRemoved({by: Some(by), member})) if by == member =>
    Error(CannotRemoveSelf({member: member}))
  | ({_RE, id, seq, events, state: Some(state)}, MemberRemoved({member})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some({
        ...state,
        members: state.members->Array.keep(existing => existing != member),
      }),
    })
  }
}

@genType
let restore = (id, events) => {
  let member = make(id, ~seq=events->Js.Array.length, ())
  logic->Logic.runMany(member, events)
}

@genType
let create = (t, ~date, ~name, ~label, ~by) => {
  let event = Created({
    date,
    name,
    label,
    by,
  })
  logic->Logic.run(t, event)
}

@genType
let addMember = (t, ~date, ~by, ~member) => {
  let event = MemberAdded({
    date,
    by,
    member,
  })
  logic->Logic.run(t, event)
}

@genType
let removeMember = (t, ~date, ~by, ~member) => {
  let event = MemberRemoved({
    date,
    by,
    member,
  })
  logic->Logic.run(t, event)
}
