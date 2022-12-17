import { makeApp } from '~/app';
import { entryPath } from '~/common';

if (import.meta.env.DEV || process.argv[1] === entryPath) {
  const app = await makeApp({
    dev: import.meta.env.DEV,
  });

  await app.listen({ port: 3000 });

  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', async () => {
      // @ts-ignore
      await app.vite.devServer.close();
      await app.close();
    });

    import.meta.hot.dispose(async () => {
      // @ts-ignore
      await app.vite.devServer.close();
      await app.close();
    });
  }
}

export * from './client';
