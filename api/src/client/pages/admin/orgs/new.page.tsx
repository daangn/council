import { CreateOrganizationPageDocument } from '~/client/graphql.gen';
import { type PageContext } from '~/client/ssr';

export async function getPageProps({ req }: PageContext) {
  if (!req.sessionOrRedirect()) {
    return;
  }

  if (!req.activeMemberOrRedirect()) {
    return;
  }

  /* GraphQL */`
    query CreateOrganizationPage {
      site {
        permissions {
          canCreateOrganization
        }
      }
    }
  `;
  const result = await req.executeGraphQL(CreateOrganizationPageDocument);
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
