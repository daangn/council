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
    async findOrganization(id) {
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
        return null;
      }

      const organization = Organization.make(snapshot.stream_id, {
        state: snapshot.state as Organization.state,
        seq: Number(snapshot.sequence),
      });

      if (!organization.state) {
        app.log.error('uninitalized organization %o', organization);
        return null;
      }

      return organization;
    },
  };
}
