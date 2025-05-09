import { gql } from '@apollo/client';

export const GET_SCOPES = gql`
  query GetScopes {
    scopes
  }
`;
