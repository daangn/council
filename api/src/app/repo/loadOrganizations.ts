import { Organization } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  loadOrganizations(ids: string[]): Promise<Array<Organization.t | Error>>;
}> = (app) => {
  return {
    async loadOrganizations(ids) {
      const snapshots = await app.prisma.councilSnapshot.findMany({
        select: {
          stream_id: true,
          sequence: true,
          state: true,
        },
        where: {
          aggregate_name: 'Organization',
          stream_id: {
            in: ids,
          },
        },
      });
      const snapshotMap = new Map(snapshots.map((snapshot) => [snapshot.stream_id, snapshot]));
      const members = ids.map((id) => {
        const snapshot = snapshotMap.get(id);
        return snapshot
          ? Organization.make(id, {
              state: snapshot.state as Organization.state,
              seq: Number(snapshot.sequence),
            })
          : new Error(`Organization(id: ${id}) doesn't exist.`);
      });
      return members;
    },
  };
};

export default repo;
