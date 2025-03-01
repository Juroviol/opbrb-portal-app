import { gql } from '@apollo/client';

export const GET_LOGGED_USER = gql`
  query {
    getLoggedUser {
      _id
      name
      email
      role
      scopes
      pictureUrl
    }
  }
`;

export const AUTHENTICATE = gql`
  mutation Authenticate($username: String!, $password: String!) {
    authenticate(username: $username, password: $password) {
      token
    }
  }
`;
