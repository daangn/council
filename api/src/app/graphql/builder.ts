import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';

import { type GraphQLContext } from './context';

export const builder = new SchemaBuilder<{
  AuthScopes: {
    loggedIn: boolean;
    approvedMember: boolean;
  };
  Context: GraphQLContext;
}>({
  plugins: [DataloaderPlugin, ScopeAuthPlugin],
  authScopes: async (context) => ({
    loggedIn: !!context.req.currentSession,
    approvedMember: !!context.req.currentMember?.state?.approved,
  }),
});
