@genType.as("CouncilAggregate")
type aggregate = [
  | #Session(Council_Entity_Session.t)
  | #Member(Council_Entity_Member.t)
]

@genType.as("CouncilEventStore")
type eventStore = {persist: (. aggregate) => Js.Promise2.t<aggregate>}
