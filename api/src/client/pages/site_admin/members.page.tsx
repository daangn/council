import { Link } from 'react-router-dom';
import { PageContext } from '~/client/ssr';

import { SiteAdminMembersPageDocument } from './members.graphql.gen';

export async function getPageProps({ req, reply }: PageContext) {
  const { data } = await req.executeGraphQL(SiteAdminMembersPageDocument);
  if (!data?.site.permissions.siteAdmin) {
    if (req.currentSession) {
      return reply.redirect(403, '/denied');
    } else {
      return reply.redirect('/admin/login?redirect_to=/site_admin');
    }
  }
}

export default function SiteAdminMembersPage() {
  return (
    <div>
      <div className="breadcrumbs">
        <ul>
          <li>
            <Link to="/site_admin">
              Site Admin
            </Link>
          </li>
          <li>
            Members
          </li>
        </ul>
      </div>
      <main>
        <h1>
          Members
        </h1>
      </main>
    </div>
  )
}

