import { makeApp } from './app';

const app = makeApp({
  dev: import.meta.env.DEV,
});

app.listen({ port: 3000 });

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    app.close();
  });

  import.meta.hot.dispose(() => {
    app.close();
  });
}
