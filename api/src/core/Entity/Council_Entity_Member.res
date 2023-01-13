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
  joinedOrganizations: array<organizationId>,
}

@genType
type state =
  | Requested({data: data, at: Date.t})
  | Rejected({data: data, at: Date.t, by: option<memberId>})
  | Active({data: data})
  | Inactive({data: data})

@genType
type event =
  | Created({date: Date.t, auth: string, name: string, email: string})
  | SingupApproved({date: Date.t, by: option<memberId>})
  | SingupRejected({date: Date.t, by: option<memberId>})
  | AdminGranted({date: Date.t, by: option<memberId>})
  | AdminRevoked({date: Date.t, by: option<memberId>})
  | JoinedToOrganization({date: Date.t, organization: organizationId})
  | LeaveFromOrganization({date: Date.t, organization: organizationId})
  | Reactivated({date: Date.t, by: option<memberId>})
  | Deactivated({date: Date.t, by: option<memberId>})

@genType
type error =
  | Uninitialized({id: id})
  | AlreadyInitialized({id: id})
  | InactiveMember({id: id})
  | AlreadyMemeber({id: id})
  | AlreadyJoinedOrganization({id: id, organization: organizationId})
  | HasNotJoinedOrgniazation({id: id, organization: organizationId})

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
  | ({_RE, id, seq, events, state: None}, Created({date, auth, name, email})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Requested({
          at: date,
          data: {
            name,
            email,
            authProviders: [auth],
            admin: false,
            joinedOrganizations: [],
          },
        }),
      ),
    })
  | ({id, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({id: id}))
  | ({_RE, id, seq, events, state: Some(Requested({data}))}, SingupApproved(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Active({
          data: data,
        }),
      ),
    })
  | ({_RE, id, seq, events, state: Some(Requested({data}))}, SingupRejected({date, by})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Rejected({
          at: date,
          data,
          by,
        }),
      ),
    })
  | ({_RE, id, seq, events, state: Some(Active(state))}, AdminGranted(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Active({
          data: {
            ...state.data,
            admin: true,
          },
        }),
      ),
    })
  | ({_RE, id, seq, events, state: Some(Active(state))}, AdminRevoked(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Active({
          data: {
            ...state.data,
            admin: false,
          },
        }),
      ),
    })
  | ({id, state: Some(Active(state))}, JoinedToOrganization({organization}))
    if state.data.joinedOrganizations->Array.some(existing => existing == organization) =>
    Error(AlreadyJoinedOrganization({id, organization}))
  | ({_RE, id, seq, events, state: Some(Active(state))}, JoinedToOrganization({organization})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Active({
          data: {
            ...state.data,
            joinedOrganizations: state.data.joinedOrganizations->Array.concat([organization]),
          },
        }),
      ),
    })
  | ({id, state: Some(Active(state))}, LeaveFromOrganization({organization}))
    if state.data.joinedOrganizations->Array.every(existing => existing != organization) =>
    Error(HasNotJoinedOrgniazation({id, organization}))
  | ({_RE, id, seq, events, state: Some(Active(state))}, LeaveFromOrganization({organization})) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Active({
          data: {
            ...state.data,
            joinedOrganizations: state.data.joinedOrganizations->Array.keep(existing =>
              existing != organization
            ),
          },
        }),
      ),
    })
  | ({_RE, id, seq, events, state: Some(Active({data}) | Inactive({data}))}, Deactivated(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Inactive({
          data: data,
        }),
      ),
    })
  | ({_RE, id, seq, events, state: Some(Active({data}) | Inactive({data}))}, Reactivated(_)) =>
    Ok({
      _RE,
      id,
      seq,
      events: events->Array.concat([event]),
      state: Some(
        Active({
          data: data,
        }),
      ),
    })
  | ({id, state: Some(Active(_))}, _) => Error(AlreadyMemeber({id: id}))
  | ({id, state: Some(Requested(_) | Rejected(_) | Inactive(_))}, _) =>
    Error(InactiveMember({id: id}))
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

@genType
let rejectSignup = (t, ~date, ~by) => {
  let event = SingupRejected({date, by})
  logic->Logic.run(t, event)
}

@genType
let joinToOrganization = (t, ~date, ~organization) => {
  let event = JoinedToOrganization({date, organization})
  logic->Logic.run(t, event)
}

@genType
let leaveFromOrganization = (t, ~date, ~organization) => {
  let event = LeaveFromOrganization({date, organization})
  logic->Logic.run(t, event)
}
