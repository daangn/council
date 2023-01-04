import * as React from 'react';

import { type PageContext } from '~/client/ssr';

type PageProps = {
  suggestedName?: string,
  suggestedEmail?: string,
};

export async function getPageProps({ app, req, reply }: PageContext) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return reply.redirect('/admin/login');
  }

  const session = await app.repo.findSession(sessionId);
  if (!session?.state) {
    reply.clearCookie('sessionId');
    reply.clearCookie('memberId');
    return reply.redirect('/admin/login');
  }

  const member = await app.repo.findMemberByAuth(session.state.subject);
  // TODO

  return {
    suggestedName: session.state.suggestedName,
    suggestedEmail: session.state.verifiedEmail || session.state.suggestedEmail,
  };
}

export async function postAction({ app, req, reply }: PageContext) {
  const data = await req.executeGraphQL(/* GraphQL */`
    mutation RequestSignup($name: String!, $email: String!) {
      requestSignup(input: {
        name: $name,
        email: $email,
      }) {
        member {
          id
        }
      }
    }`,
    req.body,
  );
  return data;
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

