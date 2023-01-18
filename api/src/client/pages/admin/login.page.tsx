import * as React from 'react';

export default function IndexPage() {
  const handleLogin: React.MouseEventHandler = (e) => {
    e.preventDefault();

    const search = new URLSearchParams(window.location.search);
    const redirectTo = search.get('redirect_to');

    const url = new URL('/authorize', `https://${import.meta.env.VITE_AUTH0_DOMAIN}`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', import.meta.env.VITE_AUTH0_CLIENT_ID);
    url.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback${redirectTo ? `?redirect_to=${redirectTo}` : ''}`);
    url.searchParams.set('scope', 'openid profile email');

    window.location.href = url.toString();
  };

  return (
    <div>
      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
