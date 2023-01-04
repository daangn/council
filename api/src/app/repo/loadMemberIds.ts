import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

export default (app: FastifyInstance) => {
  async function loadeMembers(memberIds: string[]): Promise<Array<Member.t | Error>> {
    const snapshots = await app.prisma.councilSnapshot.findMany({
      select: {
        stream_id: true,
        sequence: true,
        state: true,
      },
      where: {
        aggregate_name: 'Member',
        stream_id: {
          in: memberIds,
        },
      },
    });
    const snapshotMap = new Map(snapshots.map((snapshot) => [snapshot.stream_id, snapshot]));
    const members = memberIds.map((id) => {
      const snapshot = snapshotMap.get(id);
      return snapshot
        ? Member.make(id, {
            state: snapshot.state as Member.state,
            seq: Number(snapshot.sequence),
          })
        : new Error(`Member(${id}) doesn't exist.`);
    });
    return members;
  }

  return { loadeMembers };
};
