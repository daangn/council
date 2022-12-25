open Council_Domain

module Session = Council_Entity_Session
module Member = Council_Entity_Member

@genType
type error =
  | Invariant
  | IOError({exn: Js.Exn.t})
  | InvalidSession({session: option<Session.id>})
  | InvalidMember({member: option<Member.id>})
  | SessionError({error: Session.error})
  | MemberError({error: Member.error})

@genType
let createSession = async (~eventStore, ~sessionId, ~date, ~data) => {
  let session = Session.make(sessionId, ())
  switch Session.create(session, ~date, ~data) {
  | Ok(session) =>
    switch await eventStore.persist(. #Session(session)) {
    | #Session(session) => Ok(session)
    | _ => Error(Invariant)
    | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
    }
  | Error(error) => Error(SessionError({error: error}))
  }
}

@genType
let findOrCreateSession = async (~eventStore, ~findSession, ~sessionId, ~date, ~data) => {
  switch await findSession(. sessionId) {
  | Some(session) => Ok(session)
  | None =>
    switch await createSession(~eventStore, ~sessionId, ~date, ~data) {
    | Ok(session) => Ok(session)
    | error => error
    }
  | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
  }
}

@genType
let verifySession = async (~findSession, ~sessionId) => {
  switch sessionId {
  | Some(sessionId) =>
    switch await findSession(. sessionId) {
    | Some(session) =>
      switch session {
      | {Session.state: Some(_)} => Ok(session)
      | _ => Error(InvalidSession({session: Some(sessionId)}))
      }
    | None => Error(InvalidSession({session: Some(sessionId)}))
    | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
    }
  | None => Error(InvalidSession({session: None}))
  }
}

@genType
let verifyMemberSession = async (~findSession, ~findMember, ~sessionId, ~memberId) => {
  switch await verifySession(~findSession, ~sessionId) {
  | Ok({Session.state: Some(sessionState)} as session) =>
    switch memberId {
    | Some(memberId) =>
      switch await findMember(. memberId) {
      | Some({Member.state: Some(memberState)} as member) =>
        switch memberState.authProviders->Js.Array2.includes(sessionState.subject) {
        | true => Ok(session, member)
        | false => Error(InvalidMember({member: Some(memberId)}))
        }
      | _ => Error(InvalidMember({member: Some(memberId)}))
      }
    | None => Error(InvalidMember({member: None}))
    }
  | _ => Error(InvalidSession({session: sessionId}))
  }
}
