import type {
  APIGatewayProxyEvent,
  Context as LambdaContext,
} from 'aws-lambda';

import type { AuthContextPayload } from '@redwoodjs/api';

import { GetCurrentUser } from './auth';

declare type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export interface RedwoodGraphQLContext {
  event: APIGatewayProxyEvent;
  requestContext: LambdaContext;
  currentUser?: ThenArg<ReturnType<GetCurrentUser>> | AuthContextPayload | null;
  [index: string]: unknown;
}

interface ContextFunction {
  (props: {
    context: {
      request: Request;
    };
  }): RedwoodGraphQLContext | Promise<RedwoodGraphQLContext>;
}

export const context: ContextFunction = ({ context: { request } }) => {
  // TODO: GlobalContext?
  console.log(request);
};
