module Make = (
  Config: {
    type t
  },
) => {
  type t = Config.t

  external toString: t => string = "%identity"
  external fromString: string => t = "%identity"
}
