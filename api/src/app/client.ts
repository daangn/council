// @ts-ignore
import FastifyVite from '@fastify/vite';
import { type FastifyInstance } from 'fastify';

import * as client from '~/client';
import { clientPath, entryPath } from '~/common';

import * as renderer from './renderer';

export async function setupClient(app: FastifyInstance): Promise<void> {
  await app.register(FastifyVite, {
    dev: import.meta.env.DEV,
    client,
    clientPath,
    entryPath,
    renderer,
  });

  // @ts-ignore
  await app.vite.ready();
}
