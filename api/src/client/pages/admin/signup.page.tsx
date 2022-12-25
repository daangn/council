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

  return {
    suggestedName: session.state.suggestedName,
    suggestedEmail: session.state.verifiedEmail || session.state.suggestedEmail,
  };
}

export default function SingupPage({ suggestedName, suggestedEmail }: PageProps) {
  return (
    <div>
      <div>
        Name: {suggestedName}
      </div>
      <div>
        Email: {suggestedEmail}
      </div>
    </div>
  );
}

