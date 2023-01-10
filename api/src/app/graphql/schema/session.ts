import { builder } from '~/app/graphql/builder';
import { type Session } from '~/core';

import { MemberSchema } from './member';

export const SessionSchema = builder.objectRef<Session.t>('Session').implement({
  authScopes: {
    loggedIn: true,
  },
  fields: (t) => ({
    member: t.field({
      type: MemberSchema,
      nullable: true,
      resolve: (_root, _args, ctx) => ctx.req.currentMember,
    }),
  }),
});

builder.queryFields((t) => ({
  currentSession: t.field({
    type: SessionSchema,
    authScopes: {
      loggedIn: true,
    },
    resolve: (_root, _args, ctx) => ctx.req.currentSession!,
  }),
}));
