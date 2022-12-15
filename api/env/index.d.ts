/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Auth0 Setup
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_REDIRECT_URI: string;
  readonly VITE_AUTH0_AUDIENCE: string;

  // OpenFGA Setup
  readonly VITE_OPENFGA_API_SCHEME: string;
  readonly VITE_OPENFGA_API_HOST: string;
  readonly VITE_OPENFGA_API_TOKEN: string;

  readonly VITE_OPENFGA_STORE_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
