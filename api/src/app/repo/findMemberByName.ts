import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

interface AppRepo {
  findMemberByName(name: string): Promise<Member.t | null>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
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
            path: ['value', 'data', 'name'],
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
}
