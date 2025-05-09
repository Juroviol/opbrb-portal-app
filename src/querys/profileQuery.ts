import { gql } from '@apollo/client';

export const CREATE_PROFILE = gql`
  mutation CreateProfile($name: String!, $scopes: [Scope!]!) {
    createProfile(name: $name, scopes: $scopes) {
      _id
      name
      scopes
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($_id: ID!, $scopes: [Scope!]!) {
    updateProfile(_id: $_id, scopes: $scopes) {
      _id
      name
      scopes
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation DeleteProfile($_id: ID!) {
    deleteProfile(_id: $_id)
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles($page: Int!, $size: Int!) {
    profiles(page: $page, size: $size) {
      total
      docs {
        _id
        name
        scopes
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfileById($_id: ID!) {
    profile(_id: $_id) {
      _id
      name
      scopes
    }
  }
`;
