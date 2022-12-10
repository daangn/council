module Member = Council_Entity_Member

module Transition = Framework.Transition.Make(Member)

let transition: Transition.t = (t, event) => {
  switch (t, event) {
  | ({id}, Created({data})) =>
    Ok({
      id,
      data: Some(data),
    })
  }
}

open Member

@genType
let create = (t, ~date, ~data) => {
  let event = Created({date, data})
  (t->transition(event), [event])
}

