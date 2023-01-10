import { TupleKey } from '~/app/fga';
import { builder } from '~/app/graphql/builder';
import { GraphQLContext } from '~/app/graphql/context';
import { AccountService, type Member } from '~/core';

export const MemberRolesSchema = builder.objectRef<Member.t>('MemberRoles').implement({
  fields: (t) => ({
    canCreateOrganization: t.boolean({
      async resolve(root, _args, ctx) {
        const { allowed } = await ctx.app.fga.check({
          tuple_key: TupleKey.canCreateOrganization(`member:${root.id}`),
        });
        return allowed ?? false;
      },
    }),
  }),
});

export const MemberSchema = builder.loadableObject('Member', {
  load: (ids: string[], context: GraphQLContext) => context.app.repo.loadeMemberIds(ids),
  fields: (t) => ({
    id: t.exposeID('id'),
    isApproved: t.boolean({
      resolve: (root, _args) => root.state?.approved ?? false,
    }),
    roles: t.field({ type: MemberRolesSchema, resolve: (root) => root }),
  }),
});

builder.queryFields((t) => ({
  members: t.field({
    type: [MemberSchema],
    args: {
      ids: t.arg.stringList({ required: true }),
    },
    resolve: (_root, args, ctx) => [...args.ids],
  }),

  member: t.field({
    type: MemberSchema,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (_root, args, ctx) => args.id,
  }),
}));

export const SignupInputSchema = builder.inputType('SignupInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

const ValidateSingupOutputSchema = builder
  .objectRef<{
    name: boolean;
    email: boolean;
  }>('ValidateSingupOutput')
  .implement({
    fields: (t) => ({
      name: t.exposeBoolean('name'),
      email: t.exposeBoolean('email'),
    }),
  });

const RequestSignupOutputSchema = builder
  .objectRef<{
    member: Member.t;
    isAdmin: boolean;
  }>('RequestSignupOutput')
  .implement({
    fields: (t) => ({
      member: t.expose('member', { type: MemberSchema }),
      isAdmin: t.exposeBoolean('isAdmin'),
    }),
  });

builder.mutationFields((t) => ({
  validateSignup: t.field({
    type: ValidateSingupOutputSchema,
    args: {
      input: t.arg({ type: SignupInputSchema, required: true }),
    },
    async resolve(root, args, ctx) {
      const result = await AccountService.validateSignup({
        findMemberByEmail: ctx.app.repo.findMemberByEmail,
        findMemberByName: ctx.app.repo.findMemberByName,
        name: args.input.name,
        email: args.input.email,
      });

      if (result.tag === 'Error') {
        switch (result.value.tag) {
          case 'InvalidSignup': {
            return result.value.value;
          }
          default: {
            throw result.value;
          }
        }
      }

      return {
        name: true,
        email: true,
      };
    },
  }),

  requestSignup: t.field({
    type: RequestSignupOutputSchema,
    args: {
      input: t.arg({ type: SignupInputSchema, required: true }),
    },
    authScopes: {
      loggedIn: true,
    },
    async resolve(root, args, ctx) {
      const result = await AccountService.requestSignup({
        findMemberByEmail: ctx.app.repo.findMemberByEmail,
        findMemberByName: ctx.app.repo.findMemberByName,
        countAllMembers: () => {
          return ctx.app.prisma.councilSnapshot.count({
            where: {
              aggregate_name: 'Member',
            },
          });
        },
        session: ctx.req.currentSession,
        memberId: ctx.app.genId(),
        date: Date.now(),
        name: args.input.name,
        email: args.input.email,
      });

      if (result.tag === 'Error') {
        throw result.value;
      }

      await ctx.app.fga.write({
        writes: {
          tuple_keys: [
            result.value.isAdmin
              ? TupleKey.siteAdmin(`member:${result.value.member.id}`)
              : TupleKey.siteMember(`member:${result.value.member.id}`),
          ],
        },
      });

      return ctx.app.eventStore.publishAny(result.value);
    },
  }),
}));
