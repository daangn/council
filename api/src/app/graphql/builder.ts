import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';

import { type GraphQLContext } from './context';

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
}>({
  plugins: [DataloaderPlugin],
});
