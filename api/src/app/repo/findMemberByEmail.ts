import { SpanStatusCode } from '@opentelemetry/api';
import { type FastifyInstance } from 'fastify';

import { Member } from '~/core';

interface AppRepo {
  findMemberByEmail(email: string): Promise<Member.t | null>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
  return {
    findMemberByEmail(email) {
      return app.tracer.startActiveSpan('repo findMemberByEmail', async (span) => {
        const snapshot = await app.prisma.councilSnapshot.findFirst({
          select: {
            stream_id: true,
            state: true,
            sequence: true,
          },
          where: {
            state: {
              path: ['value', 'data', 'email'],
              equals: email,
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

        const member = Member.make(snapshot.stream_id, {
          state: snapshot.state as Member.state,
          seq: Number(snapshot.sequence),
        });

        if (!member.state) {
          app.log.error('uninitalized member %o', member);
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'unitialized member' });
          span.end();
          return null;
        }

        span.setStatus({ code: SpanStatusCode.OK });
        span.end();

        return member;
      });
    },
  };
}
