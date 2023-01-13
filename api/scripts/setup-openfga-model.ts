import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';
import { parseArgs } from 'node:util';

import { env } from '~/env';

const { values } = parseArgs({
  options: {
    storeId: {
      type: 'string',
    },
  },
});

const storeId = values.storeId || env.OPENFGA_STORE_ID;
if (!storeId) {
  throw new Error(
    'No --storeId param or OPENFGA_STORE_ID env provided. Did you forgot to run `yarn workspace api vite:exec scripts/setup-openfga-store.ts` first?',
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
        can_create_document: {
          computedUserset: {
            object: '',
            relation: 'admin',
          },
        },
      },
    },
    {
      type: 'document',
      relations: {
        organization: {
          this: {},
        },
        owner: {
          this: {},
        },
        responsibility: {
          this: {},
        },
        assignee: {
          union: {
            child: [
              {
                this: {},
              },
              {
                computedUserset: {
                  object: '',
                  relation: 'responsibility',
                },
              },
            ],
          },
        },
        can_delete_draft: {
          computedUserset: {
            object: '',
            relation: 'owner',
          },
        },
        can_manage_responsibility: {
          union: {
            child: [
              {
                computedUserset: {
                  object: '',
                  relation: 'owner',
                },
              },
              {
                computedUserset: {
                  object: '',
                  relation: 'responsibility',
                },
              },
            ],
          },
        },
        can_manage_assignee: {
          union: {
            child: [
              {
                computedUserset: {
                  object: '',
                  relation: 'owner',
                },
              },
              {
                computedUserset: {
                  object: '',
                  relation: 'responsibility',
                },
              },
            ],
          },
        },
        can_manage_docuemnt: {
          computedUserset: {
            object: '',
            relation: 'responsibility',
          },
        },
        can_manage_content: {
          union: {
            child: [
              {
                computedUserset: {
                  object: '',
                  relation: 'assignee',
                },
              },
              {
                computedUserset: {
                  object: '',
                  relation: 'responsibility',
                },
              },
            ],
          },
        },
        can_publish_revision: {
          computedUserset: {
            object: '',
            relation: 'responsibility',
          },
        },
      },
    },
  ],
  schema_version: '1.0',
});

console.log(`Authorization Model ID: ${id}`);
