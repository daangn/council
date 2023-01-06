import { CredentialsMethod, OpenFgaApi, type TupleKey } from '@openfga/sdk';
import { type FastifyInstance } from 'fastify';

import { env } from '~/env';

export async function setupFga(app: FastifyInstance): Promise<void> {
  const fga = new OpenFgaApi({
    storeId: env.OPENFGA_STORE_ID,
    apiScheme: env.OPENFGA_API_SCHEME,
    apiHost: env.OPENFGA_API_HOST,
    credentials: {
      method: CredentialsMethod.ApiToken,
      config: {
        token: env.OPENFGA_API_TOKEN,
      },
    },
  });

  app.decorate('fga', fga).decorateRequest('fga', { getter: () => fga });
}

declare module 'fastify' {
  interface FastifyRequest {
    fga: OpenFgaApi;
  }
  interface FastifyInstance {
    fga: OpenFgaApi;
  }
}

export const CommonKeys = {
  siteMember(user: string): TupleKey {
    return {
      user,
      relation: 'member',
      object: 'site:all',
    };
  },
  siteAdmin(user: string): TupleKey {
    return {
      user,
      relation: 'admin',
      object: 'site:all',
    };
  },
};
