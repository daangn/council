import { type PageContext } from '~/client/ssr';

import { RequestSignupDocument } from './signup.graphql.gen';

type PageProps = {
  suggestedName?: string,
  suggestedEmail?: string,
};

export async function getPageProps({ req, reply }: PageContext) {
  const session = req.sessionOrRedirect();
  if (!session) {
    return;
  }
  if (session.state.tag === 'Member') {
    return reply.redirect('/admin');
  }
  return {
    suggestedName: session.state.value.suggestedName,
    suggestedEmail: session.state.value.suggestedEmail,
  };
}

export async function postAction({ app, req, reply }: PageContext) {
  const { data } = await req.executeGraphQL(RequestSignupDocument);
  if (data) {
    if (data.requestSignup.member.active) {
      return reply.redirect('/admin');
    } else {
      return reply.redirect('/admin/signup_requested');
    }
  }
}

export default function SingupPage({ suggestedName, suggestedEmail }: PageProps) {
  return (
    <div>
      <form action="/admin/signup" method="POST">
        <label>
          Name:
          <input type="text" name="name" defaultValue={suggestedName} />
        </label>
        <label>
          Email:
          <input type="email" name="email" defaultValue={suggestedEmail} />
        </label>
        <button type="submit">
          Request Signup
        </button>
      </form>
    </div>
  );
}

