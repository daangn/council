import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

interface AppRepo {
  loadMembers(ids: string[]): Promise<Array<Member.t | Error>>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
  return {
    async loadMembers(ids) {
      const snapshots = await app.prisma.councilSnapshot.findMany({
        select: {
          stream_id: true,
          sequence: true,
          state: true,
        },
        where: {
          aggregate_name: 'Member',
          stream_id: {
            in: ids,
          },
        },
      });
      const snapshotMap = new Map(snapshots.map((snapshot) => [snapshot.stream_id, snapshot]));
      const members = ids.map((id) => {
        const snapshot = snapshotMap.get(id);
        return snapshot
          ? Member.make(id, {
              state: snapshot.state as Member.state,
              seq: Number(snapshot.sequence),
            })
          : new Error(`Member(id: ${id}) doesn't exist.`);
      });
      return members;
    },
  };
}
