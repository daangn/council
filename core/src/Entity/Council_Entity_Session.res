module Id = Council_Entity_Section_Id

module UserId = Council_Entity_User_Id

type data = {
  subject: string,
  issuedAt: Date.t,
  expiredAt: Date.t,
  userAgent: string,
}

type state =
  | User({user: UserId.t, data: data})
  | Anonymous({data: data})

@genType
type t = {
  id: Id.t,
  state: option<state>,
}

@genType
type error =
  | Uninitialized({id: Id.t})
  | AlreadyInitialized({id: Id.t})
  | AlreadyConnected({id: Id.t, exist: UserId.t, newed: UserId.t})

@genType
type event =
  | Created({date: Js.Date.t, data: data})
  | UserConnected({date: Js.Date.t, user: UserId.t})

let transition: Transition.t<t, event, error> = (t, event) =>
  switch (t, event) {
  | ({id, state: None}, Created({data})) =>
    Ok({
      id,
      state: Some(Anonymous({data: data})),
    })
  | ({id, state: None}, _) => Error(Uninitialized({id: id}))
  | ({id, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({id: id}))
  | ({id, state: Some(Anonymous({data}))}, UserConnected({user})) =>
    Ok({
      id,
      state: Some(User({user, data})),
    })
  | ({id, state: Some(User({user: exist}))}, UserConnected({user: newed})) =>
    Error(AlreadyConnected({id, exist, newed}))
  }

@genType
let make = (id, data) => {
  id,
  state: switch data {
  | Some(data) => Some(Anonymous({data: data}))
  | None => None
  },
}

@genType
let restore = (t, events) => {
  transition->Transition.runMany(t, events)->fst
}

module Command = {
  @genType
  let create = (t, ~date, ~data) => {
    transition->Transition.run(t, Created({date, data}))
  }

  @genType
  let createWithUser = (t, ~date, ~data, ~user) => {
    let event1 = Created({date, data})
    let event2 = UserConnected({date, user})
    transition->Transition.runMany(t, [event1, event2])
  }

  @genType
  let connectUser = (t, ~date, ~user) => {
    transition->Transition.run(t, UserConnected({date, user}))
  }
}
