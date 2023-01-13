module Organization = Council_Entity_Organization
module Member = Council_Entity_Member

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
  | (name, label) => Ok({"name": name, "label": label})
  | exception Js.Exn.Error(exn) => Error(#IOError({"exn": exn}))
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
  switch await validateCreateOrganization(~findOrganizationByName, ~name, ~label) {
  | Ok(result) if result["name"] && result["label"] => {
      let organization = Organization.make(organizationId, ())
      switch (
        organization->Organization.create(~date, ~name, ~label, ~by=member.Member.id),
        member->Member.joinToOrganization(~date, ~organization=organization.id),
      ) {
      | (Ok(organization), Ok(member)) => Ok({"organization": organization, "member": member})
      | (organizationResult, memberResult) =>
        Error(
          #AggregatedError({
            "member": memberResult->Util.someError,
            "organization": organizationResult->Util.someError,
          }),
        )
      }
    }

  | Ok(result) => Error(#InvalidInput({"name": result["name"], "label": result["label"]}))
  | Error(_) as error => error
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
  open Belt
  switch await Js.Promise2.all2((findMember(. memberId), findOrganization(. organizationId))) {
  | (Some(member), Some(organization)) =>
    switch (
      organization->Organization.addMember(~member=member.Member.id, ~by, ~date),
      member->Member.joinToOrganization(~organization=organization.id, ~date),
    ) {
    | (Ok(organization), Ok(member)) => Ok({"organization": organization, "member": member})
    | (organizationResult, memberResult) =>
      Error(
        #AggregatedError({
          "member": memberResult->Util.someError,
          "organization": organizationResult->Util.someError,
        }),
      )
    }
  | (member, organization) =>
    Error(
      #InvalidParameter({
        "member": member->Option.map(member => member.id),
        "organization": organization->Option.map(organization => organization.id),
      }),
    )
  | exception Js.Exn.Error(exn) => Error(#IOError({"exn": exn}))
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
  open Belt
  switch await Js.Promise2.all2((findMember(. memberId), findOrganization(. organizationId))) {
  | (Some(member), Some(organization)) =>
    switch (
      organization->Organization.removeMember(~member=member.Member.id, ~by, ~date),
      member->Member.leaveFromOrganization(~organization=organization.id, ~date),
    ) {
    | (Ok(organization), Ok(member)) => Ok({"organization": organization, "member": member})
    | (organizationResult, memberResult) =>
      Error(
        #AggregatedError({
          "member": memberResult->Util.someError,
          "organization": organizationResult->Util.someError,
        }),
      )
    }
  | (member, organization) =>
    Error(
      #InvalidParameter({
        "member": member->Option.map(member => member.id),
        "organization": organization->Option.map(organization => organization.id),
      }),
    )
  | exception Js.Exn.Error(exn) => Error(#IOError({"exn": exn}))
  }
}
