import { Organization } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findOrganizationByName(name: string): Promise<Organization.t | null>;
}> = (app) => {
  return {
    async findOrganizationByName(name) {
      const snapshot = await app.prisma.councilSnapshot.findFirst({
        select: {
          stream_id: true,
          state: true,
          sequence: true,
        },
        where: {
          state: {
            path: ['name'],
            equals: name,
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
