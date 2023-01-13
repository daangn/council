import { builder } from '~/app/graphql/builder';

import './member';
import './organization';
import './session';
import './site';

builder.queryType();
builder.mutationType();

export const schema = builder.toSchema();
