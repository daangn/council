import { PageContext } from '~/client/ssr';

import { SiteAdminPageDocument } from './index.graphql';

export async function getPageProps({ req, reply }: PageContext) {
  const { data } = await req.executeGraphQL(SiteAdminPageDocument);
  if (!data?.site.permissions.siteAdmin) {
    if (req.currentSession) {
      return reply.redirect('/site_admin/denied');
    } else {
      return reply.redirect('/admin/login?redirect_to=/site_admin');
    }
  }
}

export default function SiteAdminPage() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pt-5 lg:pb-4">
    </div>
  )
}
