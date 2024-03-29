import { PageContext } from '~/client/ssr';

import { SiteAdminHomePageDocument } from './index.graphql.gen';

export async function getPageProps({ req, reply }: PageContext) {
  const { data } = await req.executeGraphQL(SiteAdminHomePageDocument);
  if (!data?.site.permissions.siteAdmin) {
    if (req.currentSession) {
      return reply.redirect(403, '/denied');
    } else {
      return reply.redirect('/admin/login?redirect_to=/site_admin');
    }
  }
}

export default function SiteAdminHomePage() {
  return (
    <div>
      <div className="breadcrumbs">
        <ul>
          <li>Site Admin</li>
        </ul>
      </div>
      <main>

      </main>
    </div>
  )
}
