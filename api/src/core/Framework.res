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

module Transition = {
  module Make = (Entity: Entity.Type) => {
    @genType
    type t = (Entity.t, Entity.event) => result<Entity.t, Entity.error>

    let run = (t: t, entity, event) => {
      t(entity, event)
    }

    let runMany = (t: t, entity, events) => {
      events->Belt.Array.reduce(Ok(entity), (prev, event) => prev->Belt.Result.flatMap(t(_, event)))
    }
  }
}

module Repository = {
  module Make = (
    Config: {
      module Entity: Entity.Type
      type queryOptions
    },
  ) => {
    @genType
    type t = {
      find: Config.Entity.id => Js.Promise2.t<option<Config.Entity.t>>,
      findBy: Config.queryOptions => Js.Promise2.t<option<Config.Entity.t>>,
      findAll: unit => Js.Promise2.t<array<Config.Entity.t>>,
      findAllBy: Config.queryOptions => Js.Promise2.t<array<Config.Entity.t>>,
      count: unit => Js.Promise2.t<int>,
      countBy: Config.queryOptions => Js.Promise2.t<int>,
    }
  }
}
