import { type PageContext } from '~/client/ssr';

export async function getPageProps({ req }: PageContext) {
  if (!req.sessionOrRedirect()) {
    return;
  }

  if (!req.activeMemberOrRedirect()) {
    return;
  }

  const result = await req.executeGraphQL(/* GraphQL */`
    query IndexPage {
      site {
        permissions {
          canCreateOrganization
        }
      }
    }
  `);

  return result;
}

export default function CreateOrganizationPage() {
  return (
    <div>
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Label:
          <input type="text" name="label" />
        </label>
      </form>
    </div>
  )
}
