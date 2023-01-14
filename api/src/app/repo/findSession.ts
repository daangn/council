import { type FastifyInstance } from 'fastify';

import { Session } from '~/core';

interface AppRepo {
  findSession(sessionId: string): Promise<Session.t | null>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
  return {
    async findSession(sessionId) {
      const snapshot = await app.prisma.councilSnapshot.findUnique({
        select: {
          state: true,
          sequence: true,
        },
        where: {
          aggregate_name_stream_id: {
            aggregate_name: 'Session',
            stream_id: sessionId,
          },
        },
      });

      if (!snapshot) {
        return null;
      }

      const session = Session.make(sessionId, {
        state: snapshot.state as Session.state,
        seq: Number(snapshot.sequence),
      });

      if (!session.state) {
        app.log.error('uninitalized session %o', session);
        return null;
      }

      if (session.state.value.data.expiredAt >= Date.now()) {
        return null;
      }

      return session;
    },
  };
}
