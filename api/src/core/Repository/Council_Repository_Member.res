module Entity = Council_Entity_Member
module Logic = Council_Entity_Member_Logic

@genType
include Framework.Repository.Make({
  module Entity = Entity

  type queryOptions = {email?: string}
})
