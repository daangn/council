import { type PageContext } from '~/client/ssr';

export async function getPageProps({ req }: PageContext) {
  if (!req.sessionOrRedirect()) {
    return;
  }

  if (!req.memberOrRedirect()) {
    return;
  }
}

export default function SignupRequestedPage() {
  return (
    <div>
      Signup Requested
    </div>
  );
}
