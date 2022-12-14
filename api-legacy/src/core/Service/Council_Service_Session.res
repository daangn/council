@genType
module Session = Council_Entity_Session

@genType
module SessionLogic = Council_Entity_Session_Logic

@genType
type t = {
  eventStore: Council_Domain.eventStore,
  sessionRepository: Council_Repository_Session.t,
}

@genType
let make = (~eventStore, ~sessionRepository) => {
  eventStore,
  sessionRepository,
}

let createSession = async (t, ~id, ~date, ~data) => {
  let session = Session.make(id, ())
  switch SessionLogic.create(session, ~date, ~data) {
  | Ok(session) =>
    switch await t.eventStore.persist(Session(session)) {
    | Session(session) => Ok(session)
    | _ => Error(Session.Invariant)
    | exception Js.Exn.Error(exn) => Error(IOError({id, exn}))
    }
  | error => error
  }
}

@genType
let findOrCreateSession = async (t, ~id, ~date, ~data) => {
  switch await t.sessionRepository.find(id) {
  | Some(session) => Ok(session)
  | None =>
    switch await t->createSession(~id, ~date, ~data) {
    | Ok(session) => Ok(session)
    | error => error
    }
  | exception Js.Exn.Error(exn) => Error(IOError({id, exn}))
  }
}
