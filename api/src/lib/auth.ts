import {
  type APIGatewayProxyEvent,
  type Context as LambdaContext,
} from 'aws-lambda';

import { type Decoded } from '@redwoodjs/api';
import { type SupportedAuthTypes } from '@redwoodjs/auth';
import { AuthenticationError } from '@redwoodjs/graphql-server';

import { Member, Session, SessionCommand, SessionRepository } from 'src/core';

import { sessionRepo } from './repos';

interface GetCurrentUser {
  (
    decoded: Decoded,
    raw: { type: SupportedAuthTypes; token: string },
    request: { event: APIGatewayProxyEvent; context: LambdaContext },
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

  let session = await SessionRepository.find(sessionRepo, { id: sessionId });
  if (!session) {
    const [result, events] = SessionCommand.create(
      Session.make(sessionId, null),
      {
        date: Date.now(),
        data: {
          subject: token.subject,
          issuedAt: token.issuedAt,
          expiredAt: token.expiredAt,
          userAgent: request.event.headers['user-agent'] || '',
        },
      },
    );
    if (result.tag === 'Ok') {
      await sessionRepo.save({ id: sessionId, seq: 0, events });
      session = result.value;
    }
  }

  let memberId: RedwoodUser['memberId'] = undefined;
  if (session?.state?.tag === 'Member') {
    memberId = session.state.value.member;
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
