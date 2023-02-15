import { SpanStatusCode } from '@opentelemetry/api';
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
    findMember(memberId) {
      return app.tracer.startActiveSpan('repo findMember', async (span) => {
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
          span.setAttribute('snapshot.found', false);
          span.end();
          return null;
        }
        span.setAttribute('snapshot.found', true);
        span.setAttribute('snapshot.id', memberId);
        span.setAttribute('snapshot.seq', Number(snapshot.sequence));

        const member = Member.make(memberId, {
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
