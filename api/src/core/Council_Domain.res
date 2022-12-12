@genType
type aggregate =
  | Session(Council_Entity_Session.t)
  | Member(Council_Entity_Member.t)

@genType
type eventStore = {persist: aggregate => Js.Promise2.t<aggregate>}
