import { Session } from '~/core';

import { type Injectable } from './_inject';

const repo: Injectable<{
  findSession(sessionId: string): Promise<Session.t | null>;
}> = (app) => {
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
};

export default repo;
