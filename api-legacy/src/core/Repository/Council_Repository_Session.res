module Entity = Council_Entity_Session
module Logic = Council_Entity_Session_Logic

@genType
type queryOptions = {}

@genType
include Framework.Repository.Make({
  module Entity = Entity

  type queryOptions = queryOptions
})
