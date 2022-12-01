module Make = (
  Config: {
    type t
  },
) => {
  @genType
  type t = Config.t

  @genType
  external toString: t => string = "%identity"

  @genType
  external fromString: string => t = "%identity"
}
