module Entity = Council_Entity_Session
module Command = Council_Command_Session

@genType
include Framework.Repository.Make(Entity)

@genType
let find = async (t, ~id) => {
  open Command

  let entity = Entity.make(id, None)
  switch await t.eventStream(~id, ~seq=0) {
    | ([], _) => None
    | (events, _) => switch transition->Transition.runMany(entity, events) {
      | (Ok(entity), _) => Some(entity)
      | (Error(_), _) => None
    }
  }
}
