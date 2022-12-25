import * as React from 'react';
import { StaticRouter as Router } from 'react-router-dom/server';

import staticLayouts from './staticLayouts';
import serverRoutes from './serverRoutes';
import { Root, type SSRContext } from './ssr';

import './base.css';

export function createApp(ctx: SSRContext, url: string) {
  return (
    <React.StrictMode>
      <React.Suspense fallback={null}>
        <Router location={url}>
          <Root routes={serverRoutes} layouts={staticLayouts} ctx={ctx} />
        </Router>
      </React.Suspense>
    </React.StrictMode>
  );
}
