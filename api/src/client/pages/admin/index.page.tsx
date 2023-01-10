import * as React from 'react';
import { type ExecutionResult } from 'graphql';

import { type IndexPageQuery } from '~/client/graphql.gen';
import { type PageContext } from '~/client/ssr';

export async function getPageProps({ req }: PageContext) {
  if (!req.sessionOrRedirect()) {
    return;
  }

  const member = req.memberOrRedirect();
  if (!member) {
    return;
  }

  const result = await req.executeGraphQL(/* GraphQL */`
    query IndexPage($id: String!) {
      member(id: $id) {
        id
      }
    }
  `, { id: member.id });

  return result;
}

export default function IndexPage({ data }: ExecutionResult<IndexPageQuery>) {
  return (
    <div>
      Hello World! admin: {String(data?.member.id)}
    </div>
  );
}
