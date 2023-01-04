import { Member } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findMemberByName(name: string): Promise<Member.t | null>;
}> = (app) => {
  return {
    async findMemberByName(name) {
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
