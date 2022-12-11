module Entity = {
  module type Type = {
    type id
    type data
    type t
    type event
    type error
    let make: (id, option<data>) => t
  }

  module Make = (Type: Type) => {
    include Type
  }
}

module Transition = {
  module Make = (Entity: Entity.Type) => {
    @genType
    type t = (Entity.t, Entity.event) => result<Entity.t, Entity.error>

    let run = (t: t, entity, event) => {
      (t(entity, event), [event])
    }

    let runMany = (t: t, entity, event) => {
      let next = event->Belt.Array.reduce(Ok(entity), (prev, event) => prev->Belt.Result.flatMap(t(_, event)))
      (next, event)
    }
  }
}

module Repository = {
  module Make = (Entity: Entity.Type) => {
    @genType
    type t = {
      eventStream: (~id: Entity.id, ~seq: int=?) => Js.Promise2.t<(array<Entity.event>, int)>,
      save: (~id: Entity.id, ~events: array<Entity.event>, ~seq: int) => Js.Promise2.t<unit>,
    }
  }
}