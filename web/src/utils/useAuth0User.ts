import { type User, type Auth0Client } from '@auth0/auth0-spa-js';

import { useAuth } from '@redwoodjs/auth';

import { useAwait } from './useAwait';
import { usePending } from './usePending';

export function useAuth0User(): User {
  const authContext = useAuth();

  const pendingKey = React.useRef(null);
  usePending(pendingKey, authContext.loading);

  const client = authContext.client as Auth0Client;
  const user = useAwait(client.getUser.bind(client)) as User;

  return user;
}
