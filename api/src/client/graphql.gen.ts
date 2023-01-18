export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddMemberToOrganization = {
  memberId: Scalars['String'];
  organizationId: Scalars['String'];
};

export type AddMemberToOrganizationOutput = {
  member: Member;
  organization: Organization;
};

export type CreateOrganizationInput = {
  label: Scalars['String'];
  name: Scalars['String'];
};

export type CreateOrganizationOutput = {
  member: Member;
  organization: Organization;
};

export type Member = {
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  joinedOrganizations: Array<Organization>;
};

export type Mutation = {
  addMemberToOrganization: AddMemberToOrganizationOutput;
  createOrganization: CreateOrganizationOutput;
  removeMemberFromOrganization: RemoveMemberFromOrganizationOutput;
  requestSignup: RequestSignupOutput;
  validateCreateOrganization: ValidateCreateOrganizationOutputSchema;
  validateSignup: ValidateSingupOutput;
};


export type MutationAddMemberToOrganizationArgs = {
  input: AddMemberToOrganization;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationRemoveMemberFromOrganizationArgs = {
  input: RemoveMemberFromOrganization;
};


export type MutationRequestSignupArgs = {
  input: SignupInput;
};


export type MutationValidateCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationValidateSignupArgs = {
  input: SignupInput;
};

export type Organization = {
  id: Scalars['ID'];
};

export type Query = {
  currentSession: Session;
  member: Member;
  members: Array<Member>;
  site: Site;
};


export type QueryMemberArgs = {
  id: Scalars['String'];
};


export type QueryMembersArgs = {
  ids: Array<Scalars['String']>;
};

export type RemoveMemberFromOrganization = {
  memberId: Scalars['String'];
  organizationId: Scalars['String'];
};

export type RemoveMemberFromOrganizationOutput = {
  member: Member;
  organization: Organization;
};

export type RequestSignupOutput = {
  isAdmin: Scalars['Boolean'];
  member: Member;
};

export type Session = {
  member: Maybe<Member>;
};

export type SignupInput = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Site = {
  permissions: SitePermissions;
};

export type SitePermissions = {
  canCreateOrganization: Scalars['Boolean'];
  siteAdmin: Scalars['Boolean'];
};

export type ValidateCreateOrganizationOutputSchema = {
  label: Scalars['Boolean'];
  name: Scalars['Boolean'];
};

export type ValidateSingupOutput = {
  email: Scalars['Boolean'];
  name: Scalars['Boolean'];
};
