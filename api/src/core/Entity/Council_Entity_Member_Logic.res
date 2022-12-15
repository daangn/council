module Transition = Framework.Transition.Make(Council_Entity_Member)

let transition: Transition.t = (t, event) => {
  switch (t, event) {
  | ({_RE, id, seq, events}, Created({data})) =>
    Ok({
      _RE,
      id,
      seq,
      events: Belt.Array.concat(events, [event]),
      state: Some(data),
    })
  | (_, DO_NOT_USE(_)) => Error(Invariant)
  }
}

open Council_Entity_Member

@genType
let create = (t, ~date, ~data) => {
  let event = Created({date, data})
  (t->transition(event), [event])
}
