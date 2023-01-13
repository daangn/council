import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';

import { type GraphQLContext } from './context';

export const builder = new SchemaBuilder<{
  AuthScopes: {
    loggedIn: boolean;
    activeMember: boolean;
  };
  Context: GraphQLContext;
}>({
  plugins: [DataloaderPlugin, ScopeAuthPlugin],
  authScopes: async (context) => ({
    loggedIn: !!context.req.currentSession,
    activeMember: context.req.currentMember?.state?.tag === 'Active',
  }),
});
