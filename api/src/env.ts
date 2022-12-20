import * as path from 'node:path';

import * as dotenv from 'dotenv';
import * as envalid from 'envalid';

import { basePath } from './common';

const defaultsPath = path.resolve(basePath, '../.env.defaults');
dotenv.config({ path: defaultsPath });

const envPath = path.resolve(basePath, '../.env');
dotenv.config({ path: envPath, override: true });

export const env = envalid.cleanEnv(process.env, {
  OPENFGA_API_SCHEME: envalid.str({ choices: ['http', 'https'] }),
  OPENFGA_API_HOST: envalid.str(),
  OPENFGA_API_TOKEN: envalid.str(),
  OPENFGA_STORE_ID: envalid.str({ default: '' }),
  COOKIE_SECRETS: envalid.str(),
});
