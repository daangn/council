import { type Callable } from '@cometjs/core';
import FastifyAuth, { type FastifyAuthFunction } from '@fastify/auth';
import { createDecoder } from 'fast-jwt';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';

import { type Member, type Session, SessionService } from '~/core';
import { env } from '~/env';

export async function setupAuth(app: FastifyInstance): Promise<void> {
  await app.register(FastifyAuth);

  const decode = createDecoder();

  app.route({
    method: 'GET',
    url: '/auth/callback',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          code: { type: 'string' },
        },
        required: ['code'],
      },
    },
    async handler(req, reply) {
      const query = req.query as { code: string };

      const self = new URL('/auth/callback', `${req.protocol}://${req.hostname}`);
      const tokenUrl = new URL('/oauth/token', `https://${import.meta.env.VITE_AUTH0_DOMAIN}`);
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          client_secret: env.AUTH0_CLIENT_SECRET,
          code: query.code,
          redirect_uri: self.toString(),
        }),
      });

      type Data = {
        access_token: string;
        id_token: string;
        scope: string;
        expires_in: number;
        token_type: 'Bearer';
      };
      type IdTokenClaims = {
        nickname?: string;
        name?: string;
        email?: string;
        email_verified?: boolean;
        picture?: string;
        updated_at: string;
        iss: string;
        sub: string;
        aud: string;
        iat: number;
        exp: number;
        sid: string;
      };
      const data: Data = await response.json();
      const decoded: IdTokenClaims = decode(data.id_token);

      const result = await SessionService.findOrCreateSession({
        findSession: app.repo.findSession,
        sessionId: decoded.sid,
        date: Date.now(),
        data: {
          subject: decoded.sub,
          issuedAt: decoded.iat,
          expiredAt: decoded.exp,
          userAgent: req.headers['user-agent'] ?? '',
        },
        suggestedName: decoded.name,
        suggestedEmail: decoded.email,
      });
      if (result.tag === 'Error') {
        app.log.error(result.value);
        throw new Error('Failed to authorize');
      }

      const session = await app.eventStore.publish(result.value);
      reply.setCookie('sessionId', session.id, { path: '/' });

      if (await app.repo.findMemberByAuth(decoded.sub)) {
        reply.redirect('/admin');
      } else {
        reply.redirect('/admin/signup');
      }
    },
  });

  app.decorate('verifySession', async (req: FastifyRequest, reply: FastifyReply, done: Callable) => {
    const result = await SessionService.verifySession({
      findSession: app.repo.findSession,
      sessionId: req.cookies.sessionId,
    });
    if (result.tag === 'Error') {
      req.log.error(result.value);
      done(result.value);
    } else {
      done();
    }
  });

  app.decorate('verifyMemberSession', async (req: FastifyRequest, reply: FastifyReply, done: Callable) => {
    const result = await SessionService.verifyMemberSession({
      findSession: app.repo.findSession,
      findMember: app.repo.findMember,
      sessionId: req.cookies.sessionId,
      memberId: req.cookies.memberId,
    });
    if (result.tag === 'Error') {
      req.log.error(result.value);
      done(result.value);
    } else {
      done();
    }
  });

  app
    .decorateRequest('currentSession', null)
    .decorateRequest('currentMemeber', null)
    .addHook('onRequest', async (req) => {
      if (!(req.url.startsWith('/admin') || req.url.startsWith('/graphql'))) {
        return;
      }
      if (req.cookies.sessionId) {
        req.currentSession = (await app.repo.findSession(req.cookies.sessionId)) || null;
      }
      if (req.currentSession?.state?.tag === 'Member') {
        req.currentMember = (await app.repo.findMember(req.currentSession.state.value.member)) || null;
      }
    });

  app.decorateRequest('sessionOrRedirect', null).addHook('onRequest', async (req, reply) => {
    req.sessionOrRedirect = function sessionOrRedirect<T>(redirectTo = '/admin/login'): T {
      if (!req.currentSession?.state) {
        reply.clearCookie('sessionId');
        reply.redirect(redirectTo);
        return null as T;
      }
      return req.currentSession as T;
    };
  });

  app.decorateRequest('memberOrRedirect', null).addHook('onRequest', async (req, reply) => {
    req.memberOrRedirect = function memberOrRedirect<T>(): T {
      if (!req.currentMember?.state) {
        reply.redirect('/admin/signup');
        return null as T;
      }
      return req.currentMember as T;
    };
  });

  app.decorateRequest('activeMemberOrRedirect', null).addHook('onRequest', async (req, reply) => {
    req.activeMemberOrRedirect = function memberOrRedirect<T>(): T {
      if (!req.currentMember?.state) {
        reply.redirect('/admin/signup');
        return null as T;
      }
      switch (req.currentMember.state.tag) {
        case 'Requested': {
          reply.redirect('/admin/signup_requested');
          return null as T;
        }
        case 'Rejected': {
          reply.redirect('/admin/signup_rejected');
          return null as T;
        }
        case 'Inactive': {
          reply.redirect('/admin/deactivated');
          return null as T;
        }
      }
      return req.currentMember as T;
    };
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    verifySession: FastifyAuthFunction;
    verifyMemberSession: FastifyAuthFunction;
  }

  interface FastifyRequest {
    currentSession: Session.t | null;
    currentMember: Member.t | null;
    sessionOrRedirect: (redirectTo?: string) => (Session.t & { state: {} }) | null;
    memberOrRedirect: (redirectTo?: string) => (Member.t & { state: {} }) | null;
    activeMemberOrRedirect: (redirectTo?: string) => (Member.t & { state: { tag: 'Active' } }) | null;
  }
}
