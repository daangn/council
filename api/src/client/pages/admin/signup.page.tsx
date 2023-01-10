import { type PageContext } from '~/client/ssr';

type PageProps = {
  suggestedName?: string,
  suggestedEmail?: string,
};

export async function getPageProps({ req, reply }: PageContext) {
  const session = req.sessionOrRedirect();
  if (!session) {
    return;
  }

  const member = req.currentMember;
  if (member) {
    return reply.redirect('/admin');
  }

  return {
    suggestedName: session.state.suggestedName,
    suggestedEmail: session.state.verifiedEmail || session.state.suggestedEmail,
  };
}

export async function postAction({ app, req, reply }: PageContext) {
  const { data } = await req.executeGraphQL(/* GraphQL */`
    mutation RequestSignup($name: String!, $email: String!) {
      requestSignup(input: {
        name: $name,
        email: $email,
      }) {
        member {
          id
          isApproved
        }
      }
    }`,
    req.body,
  );

  if (data) {
    reply.setCookie('memberId', data.requestSignup.member.id, { path: '/' });
    if (data.requestSignup.member.isApproved) {
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

