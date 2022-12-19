import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

export type SSRContext = {
  pageProps?: unknown;
};

export type PageContext = {};

export type PageRoute = {
  path: string;
  layoutPath: string;
  component: React.ComponentType;
  getPageProps?: (ctx: PageContext) => unknown;
};

export type LayoutRoute = {
  path: string;
  component: React.ComponentType;
};

type RootProps = {
  ctx: SSRContext | null;
  routes: PageRoute[];
  layouts: LayoutRoute[];
};

export function Root({ routes, layouts, ctx }: RootProps) {
  const routeGroups = React.useMemo(() => {
    return routes.reduce<Record<string, PageRoute[]>>((acc, curr) => {
      if (!acc[curr.layoutPath]) {
        acc[curr.layoutPath] = [];
      }
      acc[curr.layoutPath].push(curr);
      return acc;
    }, {});
  }, [routes, layouts]);

  return (
    <Routes>
      {layouts.map(({ path, component: Layout = 'div' }) => (
        <Route key={path} path={path} element={<Layout />}>
          {routeGroups[path]?.map(({ path, component }) => (
            <Route key={path} path={path} element={<Page ctx={ctx} path={path} component={component} />} />
          ))}
        </Route>
      ))}
    </Routes>
  );
}

type PageProps = {
  ctx: SSRContext | null;
  path: string;
  component: React.ComponentType;
};

export function Page({ ctx, path, component: Component }: PageProps) {
  if (import.meta.env.SSR) {
    if (ctx?.pageProps) {
      return <Component {...ctx.pageProps} />;
    } else {
      return <Component />;
    }
  } else {
    // on mount
    if (ctx?.pageProps) {
      return <Component {...ctx.pageProps} />;
    } else {
      const pageProps = readPageProps(path);
      if (pageProps) {
        return <Component {...pageProps} />;
      } else {
        return <Component />;
      }
    }
  }
}

type Loader =
  | { status: 'pending'; suspender: Promise<unknown> }
  | { status: 'fulfilled'; data: unknown }
  | { status: 'rejected'; error: unknown };

const loaders = new Map<string, Loader>();

function readPageProps(path: string): {} {
  let loader: Loader | undefined;
  if ((loader = loaders.get(path))) {
    switch (loader.status) {
      case 'fulfilled':
        return loader.data as {};
      case 'pending':
        throw loader.suspender;
      case 'rejected':
        throw loader.error;
    }
  } else {
    loader = {
      status: 'pending',
      suspender: (async () => {
        try {
          const response = await fetch(`/_getPageProps/${path}`);
          if (response.status === 404) {
            loaders.set(path, { status: 'fulfilled', data: undefined });
          } else {
            const data = await response.json();
            loaders.set(path, { status: 'fulfilled', data });
          }
        } catch (error: unknown) {
          loaders.set(path, { status: 'rejected', error });
        }
      })(),
    };
    loaders.set(path, loader);
    return readPageProps(path);
  }
}
