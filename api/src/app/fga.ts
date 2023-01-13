import { CredentialsMethod, OpenFgaApi, type TupleKey as FgaTupleKey } from '@openfga/sdk';
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

export const TupleKey = {
  siteMember(user: string): FgaTupleKey {
    return {
      user,
      relation: 'member',
      object: 'site:default',
    };
  },
  siteAdmin(user: string): FgaTupleKey {
    return {
      user,
      relation: 'admin',
      object: 'site:default',
    };
  },
  canCreateOrganization(user: string): FgaTupleKey {
    return {
      user,
      relation: 'can_create_organization',
      object: 'site:default',
    };
  },
};
