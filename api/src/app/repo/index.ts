import { type FastifyInstance } from 'fastify';

import { merge } from './_inject';
import findMember from './findMember';
import findMemberByAuth from './findMemberByAuth';
import findMemberByEmail from './findMemberByEmail';
import findMemberByName from './findMemberByName';
import findOrganization from './findOrganization';
import findOrganizationByName from './findOrganizationByName';
import findSession from './findSession';
import loadMembers from './loadMembers';
import loadOrganizations from './loadOrganizations';

const injectAll = merge([
  findMember,
  findMemberByAuth,
  findMemberByEmail,
  findMemberByName,
  findOrganization,
  findOrganizationByName,
  findSession,
  loadMembers,
  loadOrganizations,
] as const);
type AppRepo = ReturnType<typeof injectAll>;

export async function setupRepo(app: FastifyInstance) {
  app.decorate('repo', injectAll(app));
}

declare module 'fastify' {
  interface FastifyInstance {
    repo: AppRepo;
  }
}
