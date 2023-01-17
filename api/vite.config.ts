import * as path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { viteStaticCopy as staticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

const serverPath = path.resolve(__dirname, 'src/server.ts');

export default defineConfig(() => {
  process.env = {
    ...loadEnv('defaults', process.cwd()),
    ...loadEnv('', process.cwd()),
    ...process.env,
  };

  return {
    build: {
      target: 'esnext',
      ssr: serverPath,
      rollupOptions: {
        input: serverPath,
      },
    },
    optimizeDeps: {
      disabled: true,
    },
    plugins: [
      tsconfigPaths(),
      staticCopy({
        targets: [
          {
            src: path.resolve(__dirname, 'src/public'),
            dest: '',
          },
        ],
      }),
    ],
  };
});
