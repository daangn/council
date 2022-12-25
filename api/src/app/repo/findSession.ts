import { type FastifyInstance } from 'fastify';

import { Session } from '~/core';

export default (app: FastifyInstance) => {
  async function findSession(sessionId: string): Promise<Session.t | null> {
    const councilSnapshot = await app.prisma.councilSnapshot.findFirst({
      select: {
        state: true,
        sequence: true,
      },
      where: {
        aggregate_name: 'Session',
        stream_id: sessionId,
      },
    });

    if (!councilSnapshot) {
      return null;
    }

    const session = Session.make(sessionId, {
      state: councilSnapshot.state as Session.state,
      seq: Number(councilSnapshot.sequence),
    });

    if (!session.state) {
      app.log.error('uninitalized session %o', session);
      return null;
    }

    if (session.state.expiredAt >= Date.now()) {
      return null;
    }

    return session;
  }

  return { findSession };
};
