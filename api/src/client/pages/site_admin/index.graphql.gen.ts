import * as Types from '~/client/graphql.gen';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SiteAdminHomePageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SiteAdminHomePageQuery = { __typename?: 'Query', site: { __typename?: 'Site', permissions: { __typename?: 'SitePermissions', siteAdmin: boolean } } };


export const SiteAdminHomePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiteAdminHomePage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteAdmin"}}]}}]}}]}}]} as unknown as DocumentNode<SiteAdminHomePageQuery, SiteAdminHomePageQueryVariables>;