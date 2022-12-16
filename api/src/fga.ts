import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';

export const fga = new OpenFgaApi({
  storeId: import.meta.env.VITE_OPENFGA_STORE_ID,
  apiScheme: import.meta.env.VITE_OPENFGA_API_SCHEME,
  apiHost: import.meta.env.VITE_OPENFGA_API_HOST,
  credentials: {
    method: CredentialsMethod.ApiToken,
    config: {
      token: import.meta.env.VITE_OPENFGA_API_TOKEN,
    },
  },
});
