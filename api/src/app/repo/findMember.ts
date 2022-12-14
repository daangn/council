import { Member } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findMember(memberId: string): Promise<Member.t | null>;
}> = (app) => {
  return {
    async findMember(memberId) {
      const snapshot = await app.prisma.councilSnapshot.findUnique({
        select: {
          state: true,
          sequence: true,
        },
        where: {
          aggregate_name_stream_id: {
            aggregate_name: 'Member',
            stream_id: memberId,
          },
        },
      });

      if (!snapshot) {
        return null;
      }

      const member = Member.make(memberId, {
        state: snapshot.state as Member.state,
        seq: Number(snapshot.sequence),
      });

      if (!member.state) {
        app.log.error('uninitalized member %o', member);
        return null;
      }

      return member;
    },
  };
};

export default repo;
