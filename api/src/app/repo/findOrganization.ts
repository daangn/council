import { Organization } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findOrganization(id: string): Promise<Organization.t | null>;
}> = (app) => {
  return {
    async findOrganization(id) {
      const snapshot = await app.prisma.councilSnapshot.findUnique({
        select: {
          stream_id: true,
          state: true,
          sequence: true,
        },
        where: {
          aggregate_name_stream_id: {
            aggregate_name: 'Organization',
            stream_id: id,
          },
        },
      });

      if (!snapshot) {
        return null;
      }

      const organization = Organization.make(snapshot.stream_id, {
        state: snapshot.state as Organization.state,
        seq: Number(snapshot.sequence),
      });

      if (!organization.state) {
        app.log.error('uninitalized organization %o', organization);
        return null;
      }

      return organization;
    },
  };
};

export default repo;
