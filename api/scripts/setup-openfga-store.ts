import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk';
import dedent from 'string-dedent';
import { env } from '~/env';

if (env.OPENFGA_STORE_ID) {
  console.log('Skipped since store already set in your environment variable.');
  console.log(`Store ID: ${import.meta.env.VITE_OPENFGA_STORE_ID}`);

  process.exit(0);
}

const openFga = new OpenFgaApi({
  apiScheme: env.OPENFGA_API_SCHEME,
  apiHost: env.OPENFGA_API_HOST,
  credentials: {
    method: CredentialsMethod.ApiToken,
    config: {
      token: env.OPENFGA_API_TOKEN,
    },
  },
});

const { id: storeId } = await openFga.createStore({
  name: 'council',
});

console.log(`Store ID: ${storeId}`);
console.log();
console.log(dedent`
  Next, you can run this to complete setup.

      yarn workspace api vite:exec scripts/setup-openfga-model.ts --storeId "${storeId}"

  Also, you can add this line to your local \`.env\` file for development.

      OPENFGA_STORE_ID=${storeId}

`);
