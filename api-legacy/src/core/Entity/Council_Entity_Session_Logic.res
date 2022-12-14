module Transition = Framework.Transition.Make(Council_Entity_Session)

let transition: Transition.t = (t, event) =>
  switch (t, event) {
  | ({_RE, id, seq, events, state: None}, Created({data})) =>
    Ok({
      _RE,
      id,
      seq,
      events: Belt.Array.concat(events, [event]),
      state: Some(Anonymous({data: data})),
    })
  | ({id, state: None}, _) => Error(Uninitialized({id: id}))
  | ({id, state: Some(_)}, Created(_)) => Error(AlreadyInitialized({id: id}))
  | ({_RE, id, seq, events, state: Some(Anonymous({data}))}, MemberConnected({member})) =>
    Ok({
      _RE,
      id,
      seq,
      events: Belt.Array.concat(events, [event]),
      state: Some(Member({member, data})),
    })
  | ({id, state: Some(Member({member: exist}))}, MemberConnected({member: newed})) =>
    Error(AlreadyConnected({id, exist, newed}))
  }

open Council_Entity_Session

@genType
let create = (t, ~date, ~data) => {
  transition->Transition.run(t, Created({date, data}))
}

@genType
let createWithUser = (t, ~date, ~data, ~member) => {
  let event1 = Created({date, data})
  let event2 = MemberConnected({date, member})
  transition->Transition.runMany(t, [event1, event2])
}

@genType
let connectUser = (t, ~date, ~member) => {
  transition->Transition.run(t, MemberConnected({date, member}))
}
