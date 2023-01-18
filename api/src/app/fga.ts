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
  siteMember(props: {
    memberId: string;
  }): FgaTupleKey {
    return {
      user: `member:${props.memberId}`,
      relation: 'member',
      object: 'site:default',
    };
  },
  siteAdmin(props: {
    memberId: string;
  }): FgaTupleKey {
    return {
      user: `member:${props.memberId}`,
      relation: 'admin',
      object: 'site:default',
    };
  },
  orgSite(props: {
    organizationId: string;
  }): FgaTupleKey {
    return {
      user: 'site:default',
      relation: 'site',
      object: `organization:${props.organizationId}`,
    };
  },
  orgMember(props: {
    memberId: string;
    organizationId: string;
  }): FgaTupleKey {
    return {
      user: `member:${props.memberId}`,
      relation: 'member',
      object: `organization:${props.organizationId}`,
    };
  },
  orgAdmin(props: {
    memberId: string;
    organizationId: string;
  }): FgaTupleKey {
    return {
      user: `member:${props.memberId}`,
      relation: 'admin',
      object: `organization:${props.organizationId}`,
    };
  },
  canCreateOrganization(props: {
    memberId: string;
  }): FgaTupleKey {
    return {
      user: `member:${props.memberId}`,
      relation: 'can_create_organization',
      object: 'site:default',
    };
  },
};
