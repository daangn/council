import * as React from 'react';

import { type PageRoute } from './ssr';
import staticLayouts from './staticLayouts';

export default toClientRoutes(import.meta.glob(['./pages/**/*.page.tsx', './pages/**/*.page.bs.js']));

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
function toClientRoutes(pagesMap: Record<string, any>): PageRoute[] {
  return Object.keys(pagesMap)
    .sort((a, b) => (a > b ? -1 : 1))
    .map((pageComponentPath) => {
      const path = pageComponentPath
        // Remove ./pages
        .replace('./pages', '')
        // Remove extension
        .replace(/\.page(\.bs)?\.(j|t)sx?$/, '')
        // Replace [id] with :id
        .replace(/\[(\w+)\]/, (_, m) => `:${m}`)
        //  Replace '/index' with '/'
        .replace(/\/index$/, '/')
        // Remove trailing slash
        .replace(/([^\/]+)\/$/, '$1');
      const layoutPath = staticLayouts.find((layout) => layout.path === path)?.path ?? '/';
      const component = React.lazy(pagesMap[pageComponentPath]);
      return {
        path: path.replace(layoutPath, ''),
        layoutPath,
        component,
      };
    });
}
