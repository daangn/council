import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';

import { env } from '~/env';

export const fga = new OpenFgaApi({
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
