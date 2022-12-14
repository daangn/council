import {
  type APIGatewayProxyEvent,
  type Context as LambdaContext,
} from 'aws-lambda';

import { type Decoded } from '@redwoodjs/api';
import { type SupportedAuthTypes } from '@redwoodjs/auth';
import { AuthenticationError } from '@redwoodjs/graphql-server';

import { Member, Session, SessionService } from 'src/core';

import { db } from './db';
import { createEventStoreImpl } from './impls/EventStoreImpl';
import { createSessionRepositoryImpl } from './impls/SessionRepositoryImpl';

export interface GetCurrentUser {
  (
    decoded: Decoded,
    raw: { type: SupportedAuthTypes; token: string },
    request:
      | { event: APIGatewayProxyEvent; context: LambdaContext }
      | undefined,
  ): Promise<RedwoodUser | null>;
}

type RedwoodUser = {
  authProvider: string;
  sessionId: Session.id;
  memberId?: Member.id;
};

export const getCurrentUser: GetCurrentUser = async (decoded, raw, request) => {
  if (!decoded) {
    return null;
  }

  const token = parseToken(decoded);
  const sessionId = tokenToSessionId(token);

  const eventStore = createEventStoreImpl({ db });
  const sessionRepository = createSessionRepositoryImpl({ db });

  const sessionService = SessionService.make({ eventStore, sessionRepository });
  const session = await SessionService.findOrCreateSession(sessionService, {
    id: sessionId,
    date: Date.now(),
    data: {
      subject: token.subject,
      issuedAt: token.issuedAt,
      expiredAt: token.expiredAt,
      userAgent: request?.event.headers['user-agent'] || '',
    },
  });

  if (session.tag === 'Error') {
    return null;
  }

  let memberId: RedwoodUser['memberId'] = undefined;
  if (session?.value.state?.tag === 'Member') {
    memberId = session.value.state.value.member;
  }

  return {
    authProvider: token.subject,
    sessionId,
    memberId,
  };
};

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!context.currentUser;
};

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles?: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} - If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = () => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.");
  }
};

type ParsedToken = {
  subject: string;
  issuedAt: number;
  expiredAt: number;
};

function parseToken(decoded: NonNullable<Decoded>): ParsedToken {
  const subject = (decoded['sub'] as string).replace('|', '-');
  const issuedAt = decoded['iat'] as number;
  const expiredAt = decoded['exp'] as number;
  return { subject, issuedAt, expiredAt };
}

function tokenToSessionId({ subject, issuedAt }: ParsedToken): Session.id {
  return `session-${subject}-${issuedAt}`;
}
