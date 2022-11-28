import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';
import dedent from 'string-dedent';

export default async () => {
  const openFga = new OpenFgaApi({
    apiScheme: process.env.OPENFGA_API_SCHEME,
    apiHost: process.env.OPENFGA_API_HOST,
    credentials: {
      method: CredentialsMethod.ApiToken,
      config: {
        token: process.env.OPENFGA_API_TOKEN,
      },
    },
  });

  const { id: storeId } = await openFga.createStore({
    name: 'council',
  });

  console.log('Store ID: ' + storeId);
  console.log();
  console.log(dedent`
    Next, you can run this to complete setup.

        yarn rw exec setup-openfga-model --storeId "${storeId}"

    Also, you can add this line to your local \`.env\` file for development.
    
        OPENFGA_STORE_ID=${storeId}

  `);
};
