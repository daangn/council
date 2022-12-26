import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

export default (app: FastifyInstance) => {
  async function queryMembers(): Promise<Member.t[]> {
    const snapshots = await app.prisma.councilSnapshot.findMany({
      select: {
        stream_id: true,
        sequence: true,
        state: true,
      },
      where: {
        aggregate_name: 'Member',
      },
    });
    const members = snapshots.map((snapshot) => {
      return Member.make(snapshot.stream_id, {
        state: snapshot.state as Member.state,
        seq: Number(snapshot.sequence),
      });
    });
    return members;
  }

  return { queryMembers };
};
