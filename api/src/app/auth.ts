import { type Callable } from '@cometjs/core';
import FastifyAuth, { type FastifyAuthFunction } from '@fastify/auth';
import { SpanStatusCode } from '@opentelemetry/api';
import { createDecoder } from 'fast-jwt';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';

import { type Member, Session, SessionService } from '~/core';
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
          redirect_to: { type: 'string' },
        },
        required: ['code'],
      },
    },
    async handler(req, reply) {
      await app.tracer.startActiveSpan('auth.callback', async (parentSpan) => {
        const query = req.query as { code: string; redirect_to?: string };

        const self = new URL('/auth/callback', `${req.protocol}://${req.hostname}`);
        const tokenUrl = new URL('/oauth/token', `https://${import.meta.env.VITE_AUTH0_DOMAIN}`);

        const fetchTokenSpan = this.tracer.startSpan('fetchToken');
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
        fetchTokenSpan.end();

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

        const serviceSpan = app.tracer.startSpan('findOrCreateSession');
        const result = await SessionService.findOrCreateSession({
          findSession: app.repo.findSession,
          findMemberByAuth: app.repo.findMemberByAuth,
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
          serviceSpan.setStatus({ code: SpanStatusCode.ERROR, message: 'failed to authorize' });
          serviceSpan.end();
          parentSpan.end();
          throw new Error('Failed to authorize');
        }
        serviceSpan.setStatus({ code: SpanStatusCode.OK });

        const session = await app.eventStore.publish(result.value);
        reply.setCookie('sessionId', session.id, { path: '/' });

        if (await app.repo.findMemberByAuth(decoded.sub)) {
          if (query.redirect_to) {
            reply.redirect(query.redirect_to);
          } else {
            reply.redirect('/admin');
          }
        } else {
          reply.redirect('/admin/signup');
        }

        parentSpan.setStatus({ code: SpanStatusCode.OK });
        parentSpan.end();
      });
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
      if (!/^\/(admin|site_admin|graphql)/.test(req.url)) {
        return;
      }
      await app.tracer.startActiveSpan('auth check', async (span) => {
        if (req.cookies.sessionId) {
          req.currentSession = (await app.repo.findSession(req.cookies.sessionId)) || null;
          span.setAttribute('currentSession.id', req.currentSession?.id ?? 'null');
        }
        if (req.currentSession?.state?.tag === 'Member') {
          req.currentMember = (await app.repo.findMember(req.currentSession.state.value.member)) || null;
          span.setAttribute('currentMember.id', req.currentMember?.id ?? 'null');
        }
        span.end();
      });
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
    req.activeMemberOrRedirect = function activeMemberOrRedirect<T>(): T {
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
