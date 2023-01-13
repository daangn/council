import { builder } from '~/app/graphql/builder';
import { GraphQLContext } from '~/app/graphql/context';
import { Member, Organization, OrganizationService } from '~/core';

import { MemberSchema } from './member';

export const OrganizationSchema = builder.loadableObject('Organization', {
  load: (ids: string[], context: GraphQLContext) => context.app.repo.loadOrganizations(ids),
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

export const CreateOrganizationInputSchema = builder.inputType('CreateOrganizationInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    label: t.string({ required: true }),
  }),
});

export const CreateOrganizationOutputSchema = builder
  .objectRef<{
    organization: Organization.t;
    member: Member.t;
  }>('CreateOrganizationOutput')
  .implement({
    fields: (t) => ({
      organization: t.expose('organization', {
        type: OrganizationSchema,
      }),
      member: t.expose('member', {
        type: MemberSchema,
      }),
    }),
  });

export const ValidateCreateOrganizationOutputSchema = builder
  .objectRef<{
    name: boolean;
    label: boolean;
  }>('ValidateCreateOrganizationOutputSchema')
  .implement({
    fields: (t) => ({
      name: t.exposeBoolean('name'),
      label: t.exposeBoolean('label'),
    }),
  });

builder.mutationFields((t) => ({
  validateCreateOrganization: t.field({
    type: ValidateCreateOrganizationOutputSchema,
    args: {
      input: t.arg({ type: CreateOrganizationInputSchema, required: true }),
    },
    authScopes: {
      approvedMember: true,
    },
    async resolve(_root, args, ctx) {
      const result = await OrganizationService.validateCreateOrganization({
        findOrganizationByName: ctx.app.repo.findOrganizationByName,
        name: args.input.name,
        label: args.input.label,
      });

      if (result.tag === 'Error') {
        throw result.value;
      }

      return result.value;
    },
  }),

  createOrganization: t.field({
    type: CreateOrganizationOutputSchema,
    args: {
      input: t.arg({ type: CreateOrganizationInputSchema, required: true }),
    },
    authScopes: {
      approvedMember: true,
    },
    async resolve(_root, args, ctx) {
      const result = await OrganizationService.createOrganization({
        findOrganizationByName: ctx.app.repo.findOrganizationByName,
        organizationId: ctx.app.genId(),
        member: ctx.req.currentMember!,
        name: args.input.name,
        label: args.input.label,
        date: Date.now(),
      });

      if (result.tag === 'Error') {
        throw result.value;
      }

      return ctx.app.eventStore.publishAny(result.value);
    },
  }),
}));

export const RemoveMemberFromOrganizationInputSchema = builder.inputType('RemoveMemberFromOrganization', {
  fields: (t) => ({
    organizationId: t.string({ required: true }),
    memberId: t.string({ required: true }),
  }),
});

export const RemoveMemberFromOrganizationOutputSchema = builder
  .objectRef<{
    organization: Organization.t;
    member: Member.t;
  }>('RemoveMemberFromOrganizationOutput')
  .implement({
    fields: (t) => ({
      organization: t.expose('organization', {
        type: OrganizationSchema,
      }),
      member: t.expose('member', {
        type: MemberSchema,
      }),
    }),
  });

builder.mutationFields((t) => ({
  removeMemberFromOrganization: t.field({
    type: RemoveMemberFromOrganizationOutputSchema,
    args: {
      input: t.arg({ type: RemoveMemberFromOrganizationInputSchema, required: true }),
    },
    authScopes: {
      approvedMember: true,
    },
    async resolve(_root, args, ctx) {
      const result = await OrganizationService.removeMemberFromOrganization({
        findMember: ctx.app.repo.findMember,
        findOrganization: ctx.app.repo.findOrganization,
        memberId: args.input.memberId,
        organizationId: args.input.organizationId,
        by: ctx.req.currentMember?.id,
        date: Date.now(),
      });

      if (result.tag === 'Error') {
        throw result.value;
      }

      return ctx.app.eventStore.publishAny(result.value);
    },
  }),
}));

export const AddMemberToOrganizationInputSchema = builder.inputType('AddMemberToOrganization', {
  fields: (t) => ({
    organizationId: t.string({ required: true }),
    memberId: t.string({ required: true }),
  }),
});

export const AddMemberToOrganizationOutputSchema = builder
  .objectRef<{
    organization: Organization.t;
    member: Member.t;
  }>('AddMemberToOrganizationOutput')
  .implement({
    fields: (t) => ({
      organization: t.expose('organization', {
        type: OrganizationSchema,
      }),
      member: t.expose('member', {
        type: MemberSchema,
      }),
    }),
  });

builder.mutationFields((t) => ({
  addMemberToOrganization: t.field({
    type: AddMemberToOrganizationOutputSchema,
    args: {
      input: t.arg({ type: AddMemberToOrganizationInputSchema, required: true }),
    },
    authScopes: {
      approvedMember: true,
    },
    async resolve(_root, args, ctx) {
      const result = await OrganizationService.addMemberToOrganization({
        findMember: ctx.app.repo.findMember,
        findOrganization: ctx.app.repo.findOrganization,
        memberId: args.input.memberId,
        organizationId: args.input.organizationId,
        by: ctx.req.currentMember?.id,
        date: Date.now(),
      });

      if (result.tag === 'Error') {
        throw result.value;
      }

      return ctx.app.eventStore.publishAny(result.value);
    },
  }),
}));
