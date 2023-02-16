import * as Types from '~/client/graphql.gen';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SiteAdminOrgsPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SiteAdminOrgsPageQuery = { __typename?: 'Query', site: { __typename?: 'Site', permissions: { __typename?: 'SitePermissions', siteAdmin: boolean } } };


export const SiteAdminOrgsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiteAdminOrgsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteAdmin"}}]}}]}}]}}]} as unknown as DocumentNode<SiteAdminOrgsPageQuery, SiteAdminOrgsPageQueryVariables>;