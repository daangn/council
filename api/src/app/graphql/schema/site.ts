import { TupleKey } from '~/app/fga';
import { builder } from '~/app/graphql/builder';
import { Session } from '~/core';

export const SitePermissionSchema = builder.objectRef<Session.t>('SitePermissions').implement({
  fields: (t) => ({
    canCreateOrganization: t.boolean({
      async resolve(root, _args, ctx) {
        if (root.state?.tag === 'Member') {
          const { allowed } = await ctx.app.fga.check({
            tuple_key: TupleKey.canCreateOrganization(`member:${root.state.value.member}`),
          });
          return allowed ?? false;
        }
        return false;
      },
    }),
  }),
});

export const SiteSchema = builder.objectRef<Session.t>('Site').implement({
  fields: (t) => ({
    permissions: t.field({
      type: SitePermissionSchema,
      resolve: (root) => root,
    }),
  }),
});

builder.queryFields((t) => ({
  site: t.field({
    type: SiteSchema,
    authScopes: {
      loggedIn: true,
    },
    resolve: (_root, _args, ctx) => ctx.req.currentSession!,
  }),
}));
