import { type ExecutionResult } from 'graphql';
import { Link } from 'react-router-dom';

import { AdminPageDocument, type AdminPageQuery } from '~/client/graphql.gen';
import { type PageContext } from '~/client/ssr';

export async function getPageProps({ req }: PageContext) {
  if (!req.sessionOrRedirect()) {
    return;
  }

  if (!req.activeMemberOrRedirect()) {
    return;
  }

  /* GraphQL */`
    query AdminPage {
      site {
        permissions {
          canCreateOrganization
        }
      }
    }
  `;
  const result = await req.executeGraphQL(AdminPageDocument);
  return result;
}

export default function AdminPage({ data }: ExecutionResult<AdminPageQuery>) {
  return (
    <div>
      <header>
        여기 헤더
      </header>

      {data?.site.permissions.canCreateOrganization && (
        <Link to="/admin/orgs/new">
          Create Organization
        </Link>
      )}
    </div>
  );
}
