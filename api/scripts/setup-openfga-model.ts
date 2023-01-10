import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';
import { parseArgs } from 'node:util';
import { env } from '~/env';

const args = parseArgs({
  options: {
    storeId: {
      type: 'string',
    },
  },
});

const storeId = args.values.storeId || env.OPENFGA_STORE_ID;
if (!storeId) {
  throw new Error(
    'No --storeId param or OPENFGA_STORE_ID env provided. Did you forgot to run `yarn rw exec setup-openfga-store` first?',
  );
}

const openFga = new OpenFgaApi({
  storeId,
  apiScheme: env.OPENFGA_API_SCHEME,
  apiHost: env.OPENFGA_API_HOST,
  credentials: {
    method: CredentialsMethod.ApiToken,
    config: {
      token: env.OPENFGA_API_TOKEN,
    },
  },
});

const { authorization_model_id: id } = await openFga.writeAuthorizationModel({
  type_definitions: [
    {
      type: 'organization',
      relations: {
        site: {
          this: {},
        },
        admin: {
          this: {},
        },
        member: {
          union: {
            child: [
              {
                this: {},
              },
              {
                computedUserset: {
                  object: '',
                  relation: 'admin',
                },
              },
            ],
          },
        },
      },
    },
    {
      type: 'site',
      relations: {
        admin: {
          this: {},
        },
        member: {
          union: {
            child: [
              {
                this: {},
              },
              {
                computedUserset: {
                  object: '',
                  relation: 'admin',
                },
              },
            ],
          },
        },
        can_access_backstage: {
          computedUserset: {
            object: '',
            relation: 'member',
          },
        },
        can_create_organization: {
          computedUserset: {
            object: '',
            relation: 'admin',
          },
        },
      },
    },
  ],
  schema_version: '1.0',
});

console.log(`Authorization Model ID: ${id}`);
