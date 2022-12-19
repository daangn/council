import * as React from 'react';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div>
      <h1>Layout Test</h1>
      <React.Suspense fallback={null}>
        <Outlet />
      </React.Suspense>
    </div>
  )
}
