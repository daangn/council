import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import staticLayouts from './staticLayouts';
import clientRoutes from './clientRoutes';
import { Root, type SSRContext } from './ssr';

import './base.css';

export function createApp(ctx: SSRContext, url: string) {
  return (
    <React.StrictMode>
      <React.Suspense fallback={null}>
        <Router>
          <Root routes={clientRoutes} layouts={staticLayouts} ctx={ctx} />
        </Router>
      </React.Suspense>
    </React.StrictMode>
  );
}
