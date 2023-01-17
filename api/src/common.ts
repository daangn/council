import * as path from 'node:path';

export const entryPath = new URL(import.meta.url).pathname;
export const basePath = path.dirname(entryPath);
export const serverPath = basePath;
export const clientPath = path.join(basePath, 'client');
export const publicPath = path.join(basePath, 'public');
