import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

export default (app: FastifyInstance) => {
  async function findMember(memberId: string): Promise<Member.t | null> {
    const councilSnapshot = await app.prisma.councilSnapshot.findFirst({
      select: {
        state: true,
        sequence: true,
      },
      where: {
        aggregate_name: 'Member',
        stream_id: memberId,
      },
    });

    if (!councilSnapshot) {
      return null;
    }

    const member = Member.make(memberId, {
      state: councilSnapshot.state as Member.state,
      seq: Number(councilSnapshot.sequence),
    });

    if (!member.state) {
      app.log.error('uninitalized member %o', member);
      return null;
    }

    return member;
  }

  return { findMember };
};
