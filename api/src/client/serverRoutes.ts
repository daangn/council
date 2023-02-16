import { type PageRoute } from './ssr';
import staticLayouts from './staticLayouts';

export default toServerRoutes(import.meta.glob(['./pages/**/*.page.tsx', './pages/**/*.page.bs.js'], { eager: true }));

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
function toServerRoutes(pagesMap: Record<string, any>): PageRoute[] {
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
        // Replace '/index' with '/'
        .replace(/\/index$/, '/')
        // Remove trailing slash
        .replace(/([^\/]+)\/$/, '$1');
      const layoutPath = staticLayouts.find((layout) => path.startsWith(layout.path))?.path ?? '/';
      const component = pagesMap[pageComponentPath].default;
      const getPageProps = pagesMap[pageComponentPath].getPageProps;
      const postAction = pagesMap[pageComponentPath].postAction;
      return {
        path,
        layoutPath,
        component,
        getPageProps,
        postAction,
      };
    });
}
