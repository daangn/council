module Session = Council_Entity_Session
module Member = Council_Entity_Member

@genType
type error =
  | IOError({exn: Js.Exn.t})
  | InvalidSignup({name: bool, email: bool})
  | InvalidSession({session: option<Session.t>})
  | InvalidMember({member: option<Member.t>})
  | MemberError({error: Member.error})

@genType
let validateSignup = async (~findMemberByName, ~findMemberByEmail, ~name, ~email) => {
  let validateName = async name => {
    Js.String2.length(name) >= 2 && (await findMemberByName(. name)) == None
  }

  let validateEmail = async email => {
    let re = %re(
      "/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/"
    )
    re->Js.Re.test_(email) && (await findMemberByEmail(. email)) == None
  }

  switch await Js.Promise2.all2((validateName(name), validateEmail(email))) {
  | (true, true) => Ok()
  | (name, email) => Error(InvalidSignup({name, email}))
  | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
  }
}

@genType
let hasNoAccounts = async (~countAllMembers) => {
  switch await countAllMembers(.) {
  | count => Ok(count == 0)
  | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
  }
}

@genType
let requestSignup = async (
  ~findMemberByName,
  ~findMemberByEmail,
  ~countAllMembers,
  ~memberId,
  ~name,
  ~email,
  ~session,
  ~date,
) => {
  switch session {
  | Some({Session.state: Some(sessionState)}) =>
    switch await validateSignup(~findMemberByEmail, ~findMemberByName, ~name, ~email) {
    | Ok() => {
        let member = Member.make(memberId, ())
        switch await hasNoAccounts(~countAllMembers) {
        | Ok(true) =>
          switch Member.createAdmin(member, ~date, ~name, ~email, ~auth=sessionState.subject) {
          | Ok(member) => Ok({"member": member, "isAdmin": true})
          | Error(error) => Error(MemberError({error: error}))
          }
        | Ok(false) =>
          switch Member.create(member, ~date, ~name, ~email, ~auth=sessionState.subject) {
          | Ok(member) => Ok({"member": member, "isAdmin": false})
          | Error(error) => Error(MemberError({error: error}))
          }
        | Error(_) as error => error
        }
      }

    | Error(_) as error => error
    }
  | _ => Error(InvalidSession({session: session}))
  }
}
