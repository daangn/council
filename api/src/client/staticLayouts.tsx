import { Outlet } from 'react-router-dom';

import { type LayoutRoute } from './ssr';

export default toLayoutRoutes(
  import.meta.glob(['./pages/**/_layout.tsx', './pages/**/_layout.bs.js'], { eager: true }),
);

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
function toLayoutRoutes(layoutsMap: Record<string, any>): LayoutRoute[] {
  const layouts = Object.keys(layoutsMap)
    .sort((a, b) => (a > b ? -1 : 1))
    .map((path) => ({
      path: path
        // Remove ./pages
        .replace('./pages', '')
        // Remove _layout
        .replace(/_layout(\.bs)?\.(j|t)sx?$/, '')
        // Remove trailing slash
        .replace(/([^\/]+)\/$/, '$1'),
      component: layoutsMap[path].default,
    }));

  if (layouts.every(layout => layout.path !== '/')) {
    layouts.push({
      path: '/',
      component: DefaultLayout,
    });
  }

  return layouts;
}

function DefaultLayout() {
  return <Outlet />;
}
