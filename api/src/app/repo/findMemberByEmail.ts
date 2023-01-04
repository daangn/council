import { Member } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findMemberByEmail(email: string): Promise<Member.t | null>;
}> = (app) => {
  return {
    async findMemberByEmail(email) {
      const snapshot = await app.prisma.councilSnapshot.findFirst({
        select: {
          stream_id: true,
          state: true,
          sequence: true,
        },
        where: {
          state: {
            path: ['email'],
            equals: email,
          },
        },
      });

      if (!snapshot) {
        return null;
      }

      const member = Member.make(snapshot.stream_id, {
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
