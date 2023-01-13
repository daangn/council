import { type FastifyInstance } from 'fastify';

import { merge } from './_inject';

const modules = await Promise.all([
  import('./findMember'),
  import('./findMemberByAuth'),
  import('./findMemberByEmail'),
  import('./findMemberByName'),
  import('./findOrganization'),
  import('./findOrganizationByName'),
  import('./findSession'),
  import('./loadMembers'),
  import('./loadOrganizations'),
]);

const inject = merge(modules);
type AppRepo = ReturnType<typeof inject>;

export async function setupRepo(app: FastifyInstance) {
  app.decorate('repo', inject(app));
}

declare module 'fastify' {
  interface FastifyInstance {
    repo: AppRepo;
  }
}
