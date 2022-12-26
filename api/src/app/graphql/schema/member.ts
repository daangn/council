import { builder } from '~/app/graphql/builder';
import { GraphQLContext } from '~/app/graphql/context';
import { AccountService } from '~/core';

const Member = builder.loadableObject('Member', {
  load: (ids: string[], context: GraphQLContext) => context.app.repo.loadeMembers(ids),
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

builder.queryType({
  fields: (t) => ({
    members: t.field({
      type: [Member],
      args: {
        ids: t.arg.stringList({ required: true }),
      },
      resolve: (_root, args, context) => [...args.ids],
    }),

    member: t.field({
      type: Member,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: (_root, args, context) => args.id,
    }),
  }),
});

const SignupInput = builder.inputType('SignupInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

const ValidateSingupOutput = builder
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

builder.mutationType({
  fields: (t) => ({
    validateSignup: t.field({
      type: ValidateSingupOutput,
      args: {
        input: t.arg({ type: SignupInput, required: true }),
      },
      resolve(root, args) {
        const result = AccountService.validateSignup({
          name: args.input.name,
          email: args.input.email,
        });

        if (result.tag === 'Error') {
          switch (result.value.tag) {
            case 'IOError': {
              throw result.value.value.exn;
            }
            case 'InvalidSignup': {
              return result.value.value;
            }
          }
        }

        return {
          name: true,
          email: true,
        };
      },
    }),
  }),
});
