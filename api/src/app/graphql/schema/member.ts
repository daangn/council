import { CommonKeys } from '~/app/fga';
import { builder } from '~/app/graphql/builder';
import { GraphQLContext } from '~/app/graphql/context';
import { AccountService, type Member } from '~/core';

const MemberSchema = builder.loadableObject('Member', {
  load: (ids: string[], context: GraphQLContext) => context.app.repo.loadeMembers(ids),
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

builder.queryType({
  fields: (t) => ({
    members: t.field({
      type: [MemberSchema],
      args: {
        ids: t.arg.stringList({ required: true }),
      },
      resolve: (_root, args, context) => [...args.ids],
    }),

    member: t.field({
      type: MemberSchema,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: (_root, args, context) => args.id,
    }),
  }),
});

const SignupInputSchema = builder.inputType('SignupInput', {
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
  }>('RequestSignupOutput')
  .implement({
    fields: (t) => ({
      member: t.expose('member', { type: MemberSchema }),
    }),
  });

builder.mutationType({
  fields: (t) => ({
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
      async resolve(root, args, ctx) {
        const signupResult = await AccountService.requestSignup({
          findMemberByEmail: ctx.app.repo.findMemberByEmail,
          findMemberByName: ctx.app.repo.findMemberByName,
          session: ctx.req.currentSession,
          memberId: ctx.app.genId(),
          date: Date.now(),
          name: args.input.name,
          email: args.input.email,
        });
        if (signupResult.tag === 'Error') {
          throw signupResult.value;
        }

        const countResult = await AccountService.hasNoAccounts({
          countAllMembers: () =>
            ctx.app.prisma.councilSnapshot.count({
              where: {
                aggregate_name: 'Member',
              },
            }),
        });
        if (countResult.tag === 'Error') {
          throw countResult.value;
        }
        if (countResult.value) {
          await ctx.app.fga.write({
            writes: {
              tuple_keys: [CommonKeys.siteAdmin(`member:${signupResult.value.member.id}`)],
            },
          });
        }

        return ctx.app.eventStore.publishAny(signupResult.value);
      },
    }),
  }),
});
