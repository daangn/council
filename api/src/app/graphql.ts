import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type OpenFgaApi } from '@openfga/sdk';
import SchemaBuilder from '@pothos/core';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { type DocumentNode } from 'graphql';
import { type YogaInitialContext, createYoga } from 'graphql-yoga';

export type GraphQLContext = {
  fga: OpenFgaApi;
};

export async function contextFactory(
  serverContext: YogaInitialContext & {
    req: FastifyRequest;
    reply: FastifyReply;
  },
): Promise<GraphQLContext> {
  return {
    fga: serverContext.req.fga,
  };
}

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
}>({});

export async function setupGraphQL(app: FastifyInstance): Promise<void> {
  const graphQLServer = createYoga<
    {
      req: FastifyRequest;
      reply: FastifyReply;
    },
    GraphQLContext
  >({
    context: contextFactory,
    schema: builder.toSchema(),
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

  function makeGraphQLExecutor(req: FastifyRequest, reply: FastifyReply) {
    const { execute, schema } = graphQLServer.getEnveloped({ req, reply });
    return <TData = unknown, TVariables = Record<string, unknown>>(props: {
      document: string | DocumentNode | TypedDocumentNode<TData, TVariables>;
      variables?: TVariables;
    }): Promise<TData> => {
      return execute({ schema, document: props.document, variableValues: props.variables });
    };
  }
  app.decorateRequest('executeGraphQL', null);
  app.addHook('onRequest', async (req, reply) => {
    req.executeGraphQL = makeGraphQLExecutor(req, reply);
  });
}

declare module 'fastify' {
  interface FastifyRequest {
    executeGraphQL<TData = unknown, TVariables = Record<string, unknown>>(props: {
      document: string | DocumentNode | TypedDocumentNode<TData, TVariables>;
      variables?: TVariables;
    }): Promise<TData>;
  }
}
