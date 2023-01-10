import { builder } from '~/app/graphql/builder';

import './member';
import './session';

builder.queryType();
builder.mutationType();

export const schema = builder.toSchema();
