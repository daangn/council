module Session = Council_Entity_Session
module Member = Council_Entity_Member

@genType
let findOrCreateSession = async (
  ~findSession,
  ~findMemberByAuth,
  ~sessionId,
  ~date,
  ~data,
  ~suggestedName,
  ~suggestedEmail,
) => {
  switch await findSession(. sessionId) {
  | Some({Session.state: Some(_)} as session) => Ok(session)
  | Some({Session.state: None}) => Error(#InvalidSession({"session": Some(sessionId)}))
  | None => {
      let session = Session.make(sessionId, ())
      switch await findMemberByAuth(. data.Session.subject) {
      | Some(member) =>
        switch session->Session.createMember(~date, ~data, ~member=member.Member.id) {
        | Ok(session) => Ok(session)
        | Error(error) => Error(#SessionError({"error": error}))
        }
      | None =>
        switch session->Session.createAnonymous(~date, ~data, ~suggestedName, ~suggestedEmail) {
        | Ok(session) => Ok(session)
        | Error(error) => Error(#SessionError({"error": error}))
        }
      }
    }

  | exception Js.Exn.Error(exn) => Error(#IOError({"exn": exn}))
  }
}

@genType
let verifySession = async (~findSession, ~sessionId) => {
  switch sessionId {
  | Some(sessionId) =>
    switch await findSession(. sessionId) {
    | Some({Session.state: Some(_)} as session) => Ok(session)
    | _ => Error(#InvalidSession({"session": Some(sessionId)}))
    | exception Js.Exn.Error(exn) => Error(#IOError({"exn": exn}))
    }
  | None => Error(#InvalidSession({"session": None}))
  }
}

@genType
let verifyMemberSession = async (~findSession, ~findMember, ~sessionId, ~memberId) => {
  switch await verifySession(~findSession, ~sessionId) {
  | Ok({Session.state: Some(Member({data}))} as session) =>
    switch memberId {
    | Some(memberId) =>
      switch await findMember(. memberId) {
      | Some({Member.state: Some(Active(memberState))} as member) =>
        switch memberState.data.authProviders->Js.Array2.includes(data.subject) {
        | true => Ok({"member": member, "session": session})
        | false => Error(#InvalidMember({"member": Some(memberId)}))
        }
      | _ => Error(#InvalidMember({"member": Some(memberId)}))
      }
    | None => Error(#InvalidMember({"member": None}))
    }
  | Ok({Session.id: sessionId}) => Error(#InvalidSession({"session": Some(sessionId)}))
  | Error(_) as error => error
  }
}
