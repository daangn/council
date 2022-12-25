import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import preload from 'vite-plugin-preload';

const entryPath = new URL(import.meta.url).pathname;
const basePath = path.dirname(entryPath);
const distPath = path.resolve(basePath, '../../dist/client');

export default defineConfig({
  root: basePath,
  plugins: [react({ jsxRuntime: 'automatic' }), preload()],
  build: {
    rollupOptions: {
      output: {
        dir: distPath,
      },
    },
  },
});
