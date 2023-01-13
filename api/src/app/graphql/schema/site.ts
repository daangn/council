import { TupleKey } from '~/app/fga';
import { builder } from '~/app/graphql/builder';
import { Member } from '~/core';

export const SitePermissionSchema = builder.objectRef<Member.t>('SitePermissions').implement({
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
