import { type FastifyInstance } from 'fastify';

import { Organization } from '~/core';

interface AppRepo {
  loadOrganizations(ids: string[]): Promise<Array<Organization.t | Error>>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
  return {
    loadOrganizations(ids) {
      return app.tracer.startActiveSpan('repo loadOrganizations', async (span) => {
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

        span.end();
        return members;
      });
    },
  };
}
