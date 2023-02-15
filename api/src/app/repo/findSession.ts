import { SpanStatusCode } from '@opentelemetry/api';
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
    findSession(sessionId) {
      return app.tracer.startActiveSpan('repo findSession', async (span) => {
        const snapshot = await app.prisma.councilSnapshot.findUnique({
          select: {
            stream_id: true,
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
          span.setAttribute('snapshot.found', false);
          span.end();
          return null;
        }
        span.setAttribute('snapshot.found', true);
        span.setAttribute('snapshot.id', snapshot.stream_id);
        span.setAttribute('snapshot.seq', Number(snapshot.sequence));

        const session = Session.make(sessionId, {
          state: snapshot.state as Session.state,
          seq: Number(snapshot.sequence),
        });

        if (!session.state) {
          app.log.error('uninitalized session %o', session);
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'uninitalized session' });
          span.end();
          return null;
        }

        if (session.state.value.data.expiredAt >= Date.now()) {
          return null;
        }

        span.setStatus({ code: SpanStatusCode.OK });
        span.end();

        return session;
      });
    },
  };
}
