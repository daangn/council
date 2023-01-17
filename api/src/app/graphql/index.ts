import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { createYoga } from 'graphql-yoga';
import { type DocumentNode, type ExecutionResult, lexicographicSortSchema, printSchema } from 'graphql/index.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { publicPath } from '~/common';

import { type GraphQLContext, contextFactory } from './context';
import { schema } from './schema';

export async function setupGraphQL(app: FastifyInstance): Promise<void> {
  const graphQLServer = createYoga<
    {
      req: FastifyRequest;
      reply: FastifyReply;
    },
    GraphQLContext
  >({
    schema,
    context: contextFactory(app),
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg)),
    },
  });

  app.addContentTypeParser('multipart/form-data', {}, (req, payload, done) => done(null));

  app.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await graphQLServer.handleNodeRequest(req, { req, reply });
      for (const [name, value] of response.headers) {
        reply.header(name, value);
      }
      reply.status(response.status);
      reply.send(response.body);
      return reply;
    },
  });

  const sdlPath = path.resolve(publicPath, 'sdl.graphql');
  if (import.meta.env.DEV) {
    await fs.writeFile(sdlPath, printSchema(lexicographicSortSchema(schema)), 'utf-8');
  }

  app.get('/sdl.graphql', async (req, reply) => {
    reply.type('application/graphql');
    reply.sendFile(sdlPath);
  });

  function makeGraphQLExecutor(req: FastifyRequest, reply: FastifyReply) {
    const { execute, schema, parse, validate } = graphQLServer.getEnveloped({ req, reply });
    return async <TData = unknown, TVariables = Record<string, unknown>>(
      document: string | DocumentNode | TypedDocumentNode<TData, TVariables>,
      variables?: TVariables,
    ): Promise<ExecutionResult<TData>> => {
      const context = contextFactory(app);
      if (typeof document === 'string') {
        const parsedDocument = parse(document);
        const validationErrors = validate(schema, parsedDocument);
        if (validationErrors.length > 0) {
          return reply.send(JSON.stringify({ errors: validationErrors }));
        }
        return execute({
          schema,
          document: parsedDocument,
          variableValues: variables,
          // rome-ignore lint/suspicious/noExplicitAny: <explanation>
          contextValue: await context({ req, reply } as any),
        });
      } else {
        return execute({
          schema,
          document,
          variableValues: variables,
          // rome-ignore lint/suspicious/noExplicitAny: <explanation>
          contextValue: await context({ req, reply } as any),
        });
      }
    };
  }
  app.decorateRequest('executeGraphQL', null);
  app.addHook('onRequest', async (req, reply) => {
    req.executeGraphQL = makeGraphQLExecutor(req, reply);
  });
}

declare module 'fastify' {
  interface FastifyRequest {
    // rome-ignore lint/suspicious/noExplicitAny: use any before codegen
    executeGraphQL<TData = any, TVariables = any>(
      document: string | DocumentNode | TypedDocumentNode<TData, TVariables>,
      variables?: TVariables,
    ): Promise<ExecutionResult<TData>>;
  }
}
