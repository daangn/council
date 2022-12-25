module Entity = {
  module type Type = {
    type id
    type state
    type t
    type event
    type error
    let make: (id, ~state: state=?, ~seq: int=?, unit) => t
  }

  module Make = (Type: Type) => {
    include Type
  }
}

module Logic = {
  module Make = (Entity: Entity.Type) => {
    type t = (Entity.t, Entity.event) => result<Entity.t, Entity.error>

    let run = (t: t, entity, event) => {
      t(entity, event)
    }

    let runMany = (t: t, entity, events) => {
      events->Belt.Array.reduce(Ok(entity), (prev, event) => prev->Belt.Result.flatMap(t(_, event)))
    }
  }
}
