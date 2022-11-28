import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';

export default async ({ args }) => {
  const storeId = args['storeId'] || process.env.OPENFGA_STORE_ID;
  if (!storeId) {
    throw new Error(
      'No --storeId param or OPENFGA_STORE_ID env provided. Did you forgot to run `yarn rw exec setup-openfga-store` first?',
    );
  }

  const openFga = new OpenFgaApi({
    storeId,
    apiScheme: process.env.OPENFGA_API_SCHEME,
    apiHost: process.env.OPENFGA_API_HOST,
    credentials: {
      method: CredentialsMethod.ApiToken,
      config: {
        token: process.env.OPENFGA_API_TOKEN,
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
        },
      },
      {
        type: 'organization',
        relations: {
          admin: {
            this: {},
          },
        },
      },
    ],
  });

  console.log('Authorization Model ID: ' + id);
};
