import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

interface AppRepo {
  findMember(memberId: string): Promise<Member.t | null>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
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
}
