import { TupleKey } from '~/app/fga';
import { builder } from '~/app/graphql/builder';

export const SitePermissionSchema = builder.objectRef<{}>('SitePermissions').implement({
  fields: (t) => ({
    siteAdmin: t.boolean({
      async resolve(_root, _args, ctx) {
        if (!ctx.req.currentMember) {
          return false;
        }
        const { allowed } = await ctx.app.fga.check({
          tuple_key: TupleKey.siteAdmin({ memberId: ctx.req.currentMember.id }),
        });
        return allowed ?? false;
      },
    }),
    canCreateOrganization: t.boolean({
      async resolve(_root, _args, ctx) {
        if (!ctx.req.currentMember) {
          return false;
        }
        const { allowed } = await ctx.app.fga.check({
          tuple_key: TupleKey.canCreateOrganization({ memberId: ctx.req.currentMember.id }),
        });
        return allowed ?? false;
      },
    }),
  }),
});

export const SiteSchema = builder.objectRef<{}>('Site').implement({
  fields: (t) => ({
    permissions: t.field({
      type: SitePermissionSchema,
      resolve: () => ({}),
    }),
  }),
});

builder.queryFields((t) => ({
  site: t.field({
    type: SiteSchema,
    authScopes: {
      loggedIn: true,
    },
    resolve: () => ({}),
  }),
}));
