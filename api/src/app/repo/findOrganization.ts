import { SpanStatusCode } from '@opentelemetry/api';
import { type FastifyInstance } from 'fastify';

import { Organization } from '~/core';

interface AppRepo {
  findOrganization(id: string): Promise<Organization.t | null>;
}

declare module 'fastify' {
  interface InjectedAppRepo extends AppRepo {}
  interface FastifyInstance {
    repo: InjectedAppRepo;
  }
}

export default function make(app: FastifyInstance): AppRepo {
  return {
    findOrganization(id) {
      return app.tracer.startActiveSpan('repo findOrganization', async (span) => {
        const snapshot = await app.prisma.councilSnapshot.findUnique({
          select: {
            stream_id: true,
            state: true,
            sequence: true,
          },
          where: {
            aggregate_name_stream_id: {
              aggregate_name: 'Organization',
              stream_id: id,
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

        const organization = Organization.make(snapshot.stream_id, {
          state: snapshot.state as Organization.state,
          seq: Number(snapshot.sequence),
        });

        if (!organization.state) {
          app.log.error('uninitalized organization %o', organization);
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'uninitalized organization' });
          span.end();
          return null;
        }

        span.setStatus({ code: SpanStatusCode.OK });
        span.end();

        return organization;
      });
    },
  };
}
