import { type ExecutionResult } from 'graphql';

import { IndexPageDocument, type IndexPageQuery } from '~/client/graphql';
import { type PageContext } from '~/client/ssr';
import { Link } from 'react-router-dom';

/* GraphQL */`
  query IndexPage {
    site {
      permissions {
        canCreateOrganization
      }
    }
  }
`;

export async function getPageProps({ req }: PageContext) {
  if (!req.sessionOrRedirect()) {
    return;
  }

  if (!req.activeMemberOrRedirect()) {
    return;
  }

  const result = await req.executeGraphQL(IndexPageDocument);

  return result;
}

export default function IndexPage({ data }: ExecutionResult<IndexPageQuery>) {
  return (
    <div>
      Hello World

      {data?.site.permissions.canCreateOrganization && (
        <Link to="/admin/orgs/new">
          Create Organization
        </Link>
      )}
    </div>
  );
}
