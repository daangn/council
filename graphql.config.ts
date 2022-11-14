import { type IGraphQLConfig } from 'graphql-config';

import { getPaths } from '@redwoodjs/internal';

const config: IGraphQLConfig = {
  schema: getPaths().generated.schema,
};

export default config;
