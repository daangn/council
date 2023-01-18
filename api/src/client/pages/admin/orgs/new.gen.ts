import * as Types from '~/client/graphql.gen';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateOrganizationPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateOrganizationPageQuery = { __typename?: 'Query', site: { __typename?: 'Site', permissions: { __typename?: 'SitePermissions', canCreateOrganization: boolean } } };


export const CreateOrganizationPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateOrganizationPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canCreateOrganization"}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrganizationPageQuery, CreateOrganizationPageQueryVariables>;