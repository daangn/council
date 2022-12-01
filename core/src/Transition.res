@genType
type t<'s, 'ev, 'e> = ('s, 'ev) => result<'s, 'e>

let run = (t, s, ev) => {
  (t(s, ev), [ev])
}

let runMany = (t, s, ev) => {
  let next = ev->Belt.Array.reduce(Ok(s), (prev, ev) => prev->Belt.Result.flatMap(t(_, ev)))
  (next, ev)
}
