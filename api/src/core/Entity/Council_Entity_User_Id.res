@genType
type t

external toString: t => string = "%identity"

@genType
let toString = t => t->toString

external fromString: string => t = "%identity"

@genType
let fromString = str => str->fromString
