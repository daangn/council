import { Link } from 'react-router-dom';
import { PageContext } from '~/client/ssr';

import { SiteAdminOrgsPageDocument } from './orgs.graphql.gen';

export async function getPageProps({ req, reply }: PageContext) {
  const { data } = await req.executeGraphQL(SiteAdminOrgsPageDocument);
  if (!data?.site.permissions.siteAdmin) {
    if (req.currentSession) {
      return reply.redirect(403, '/denied');
    } else {
      return reply.redirect('/admin/login?redirect_to=/site_admin');
    }
  }
}

export default function SiteAdminOrgsPage() {
  return (
    <div>
      <div className="breadcrumbs">
        <ul>
          <li>
            <Link to="/site_admin">
              Site Admin
            </Link>
          </li>
          <li>Organizations</li>
        </ul>
      </div>
      <main>
        <h1>
          Organizations
        </h1>
      </main>
    </div>
  )
}
