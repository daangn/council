import { hydrateRoot } from 'react-dom/client';

import { createApp } from './clientBase';
import { type SSRContext } from './ssr';

hydrateRoot(document.getElementById('root')!, createApp(window._SSR_, window.location.pathname));

declare global {
  interface Window {
    _SSR_: SSRContext;
  }
}
