import { Member } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findMemberByAuth(authProvider: string): Promise<Member.t | null>;
}> = (app) => {
  return {
    async findMemberByAuth(authProvider) {
      const snapshot = await app.prisma.councilSnapshot.findFirst({
        select: {
          stream_id: true,
          state: true,
          sequence: true,
        },
        where: {
          state: {
            path: ['authProviders'],
            array_contains: authProvider,
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
