@genType
type t = {
  memberRepo: Council_Repository_Member.t,
  sessionRepo: Council_Repository_Session.t,
}

@genType
let make = (~memberRepo, ~sessionRepo) => {
  memberRepo,
  sessionRepo,
}
