module Organization = Council_Entity_Organization
module Member = Council_Entity_Member

@genType
type error =
  | IOError({exn: Js.Exn.t})
  | InvalidCreateOrganization({name: bool, label: bool})
  | InvalidMember({member: option<Member.id>})
  | InvalidOrganization({organization: option<Organization.id>})
  | MemberError({error: Member.error})
  | OrganizationError({error: Organization.error})

@genType
let validateCreateOrganization = async (~findOrganizationByName, ~name, ~label) => {
  let validateName = async name => {
    let re = %re("/[a-z0-9][a-z\-]*[a-z0-9]/")
    re->Js.Re.test_(name) && (await findOrganizationByName(. name)) == None
  }

  let validateLabel = label => {
    Js.String2.length(label) >= 2
  }

  switch (await validateName(name), validateLabel(label)) {
  | (true, true) => Ok()
  | (name, label) => Error(InvalidCreateOrganization({name, label}))
  | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
  }
}

@genType
let createOrganization = async (
  ~findOrganizationByName,
  ~organizationId,
  ~date,
  ~member,
  ~name,
  ~label,
) => {
  switch member {
  | Some({Member.state: Some(_)} as member) =>
    switch await validateCreateOrganization(~findOrganizationByName, ~name, ~label) {
    | Ok() => {
        let organization = Organization.make(organizationId, ())
        switch Organization.create(organization, ~date, ~name, ~label, ~by=member.id) {
        | Ok(organization) =>
          switch Member.joinToOrganization(member, ~date, ~organization=organization.id) {
          | Ok(member) => Ok({"organization": organization, "member": member})
          | Error(error) => Error(MemberError({error: error}))
          }
        | Error(error) => Error(OrganizationError({error: error}))
        }
      }

    | Error(_) as error => error
    }

  | Some(member) => Error(InvalidMember({member: Some(member.id)}))
  | None => Error(InvalidMember({member: None}))
  }
}

@genType
let addMemberToOrganization = async (
  ~findMember,
  ~findOrganization,
  ~memberId,
  ~organizationId,
  ~by,
  ~date,
) => {
  switch await findMember(. memberId) {
  | Some({Member.state: Some(_)} as member) =>
    switch await findOrganization(. organizationId) {
    | Some({Organization.state: Some(_)} as organization) =>
      switch organization->Organization.addMember(~member=member.id, ~by, ~date) {
      | Ok(organization) =>
        switch member->Member.joinToOrganization(~organization=organization.id, ~date) {
        | Ok(member) => Ok({"organization": organization, "member": member})
        | Error(error) => Error(MemberError({error: error}))
        }
      | Error(error) => Error(OrganizationError({error: error}))
      }
    | _ => Error(InvalidOrganization({organization: Some(organizationId)}))
    | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
    }
  | _ => Error(InvalidMember({member: Some(memberId)}))
  | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
  }
}

@genType
let removeMemberFromOrganization = async (
  ~findMember,
  ~findOrganization,
  ~memberId,
  ~organizationId,
  ~by,
  ~date,
) => {
  switch await findMember(. memberId) {
  | Some({Member.state: Some(_)} as member) =>
    switch await findOrganization(. organizationId) {
    | Some({Organization.state: Some(_)} as organization) =>
      switch organization->Organization.removeMember(~member=member.id, ~by, ~date) {
      | Ok(organization) =>
        switch member->Member.leaveFromOrganization(~organization=organization.id, ~date) {
        | Ok(member) => Ok({"organization": organization, "member": member})
        | Error(error) => Error(MemberError({error: error}))
        }
      | Error(error) => Error(OrganizationError({error: error}))
      }
    | _ => Error(InvalidOrganization({organization: Some(organizationId)}))
    | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
    }
  | _ => Error(InvalidMember({member: Some(memberId)}))
  | exception Js.Exn.Error(exn) => Error(IOError({exn: exn}))
  }
}
