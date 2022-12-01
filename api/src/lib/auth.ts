import {
  type APIGatewayProxyEvent,
  type Context as LambdaContext,
} from 'aws-lambda';

import { type Decoded } from '@redwoodjs/api';
import { type SupportedAuthTypes } from '@redwoodjs/auth';
import { AuthenticationError } from '@redwoodjs/graphql-server';

import {
  databaseToSessionEvent,
  Session,
  SessionId,
  sessionIdFromToken,
} from 'src/coreUtils';

import { db } from './db';

interface GetCurrentUser {
  (
    decoded: Decoded,
    tokenInfo: { type: SupportedAuthTypes; token: string },
    contextInfo: { event: APIGatewayProxyEvent; context: LambdaContext },
  ): Promise<RedwoodUser | null>;
}

type RedwoodUser = {
  sessionId: SessionId.t;
};

export const getCurrentUser: GetCurrentUser = async (decoded, ...other) => {
  if (!decoded) {
    return null;
  }

  const sessionId = sessionIdFromToken(decoded);
  const session = Session.make(sessionId, null);
  const dbEvents = await db.councilEvent.findMany({
    where: {
      stream_id: SessionId.toString(sessionId),
      is_deleted: false,
    },
  });
  const events = dbEvents.map(databaseToSessionEvent);
  const result = Session.restore(session, events);
  if (result.tag === 'Error') {
    return null;
  }

  console.log(result);

  return { ...decoded };
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
