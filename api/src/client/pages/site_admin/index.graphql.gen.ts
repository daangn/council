import * as Types from '~/client/graphql.gen';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SiteAdminPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SiteAdminPageQuery = { __typename?: 'Query', site: { __typename?: 'Site', permissions: { __typename?: 'SitePermissions', siteAdmin: boolean } } };


export const SiteAdminPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiteAdminPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteAdmin"}}]}}]}}]}}]} as unknown as DocumentNode<SiteAdminPageQuery, SiteAdminPageQueryVariables>;