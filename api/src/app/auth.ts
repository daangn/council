import { type Callable } from '@cometjs/core';
import FastifyAuth from '@fastify/auth';
import { createDecoder } from 'fast-jwt';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';

import { SessionService } from '~/core';
import { env } from '~/env';

export async function setupAuth(app: FastifyInstance): Promise<void> {
  await app.register(FastifyAuth);

  const decode = createDecoder();

  app.decorate('verifySession', async (req: FastifyRequest, reply: FastifyReply, done: Callable) => {
    const result = await SessionService.verifySession({
      sessionId: req.cookies.sessionId,
      findSession: app.repo.findSession,
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
      sessionId: req.cookies.sessionId,
      memberId: req.cookies.memberId,
      findSession: app.repo.findSession,
      findMember: app.repo.findMember,
    });
    if (result.tag === 'Error') {
      req.log.error(result.value);
      done(result.value);
    } else {
      done();
    }
  });

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
        eventStore: app.eventStore,
        findSession: app.repo.findSession,
        sessionId: decoded.sid,
        date: Date.now(),
        data: {
          subject: decoded.sub,
          issuedAt: decoded.iat,
          expiredAt: decoded.exp,
          userAgent: req.headers['user-agent'] ?? '',
          suggestedName: decoded.name,
          suggestedEmail: decoded.email,
          verifiedEmail: decoded.email_verified ? decoded.email : undefined,
        },
      });
      if (result.tag === 'Error') {
        app.log.error(result.value);
        throw new Error('Failed to authorize');
      }

      const session = result.value;
      reply.setCookie('sessionId', session.id, { path: '/admin' });
      reply.redirect('/admin/signup');
    },
  });
}
