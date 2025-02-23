import { gql } from '@apollo/client';

export const GET_PASTORS = gql`
  query GetPastors($page: Int!, $size: Int!) {
    getPastors(page: $page, size: $size) {
      total
      docs {
        _id
        name
        church
        createdAt
        cellPhone
        status
      }
    }
  }
`;

export const GET_PASTOR = gql`
  query GetPastor($id: ID!) {
    getPastor(id: $id) {
      _id
      name
      cpf
      email
      maritalStatus
      birthday
      street
      number
      city
      state
      district
      zipCode
      cellPhone
      church
      ordinanceTime
      status
      recommendationLetterUrl
      paymentConfirmationUrl
    }
  }
`;

export const GET_PASTOR_PERSONAL_INFO = gql`
  query GetPastor($id: ID!) {
    getPastor(id: $id) {
      name
      cpf
      birthday
      maritalStatus
    }
  }
`;

export const GET_PASTOR_ADDRESS_INFO = gql`
  query GetPastor($id: ID!) {
    getPastor(id: $id) {
      street
      number
      city
      state
      district
      zipCode
    }
  }
`;

export const GET_PASTOR_CONTACT_INFO = gql`
  query GetPastor($id: ID!) {
    getPastor(id: $id) {
      cellPhone
      email
    }
  }
`;

export const GET_PASTOR_MINISTRY_INFO = gql`
  query GetPastor($id: ID!) {
    getPastor(id: $id) {
      church
      ordinanceTime
    }
  }
`;

export const CREATE_PASTOR = gql`
  mutation CreatePastor(
    $fileLetter: Upload
    $filePaymentConfirmation: Upload
    $name: String!
    $cpf: String!
    $email: String!
    $password: String!
    $maritalStatus: MaritalStatus!
    $birthday: Date!
    $street: String!
    $number: String!
    $city: String!
    $state: String!
    $district: String!
    $zipCode: String!
    $cellPhone: String!
    $church: String!
    $ordinanceTime: Int!
  ) {
    createPastor(
      fileLetter: $fileLetter
      filePaymentConfirmation: $filePaymentConfirmation
      name: $name
      cpf: $cpf
      email: $email
      password: $password
      maritalStatus: $maritalStatus
      birthday: $birthday
      street: $street
      number: $number
      city: $city
      state: $state
      district: $district
      zipCode: $zipCode
      cellPhone: $cellPhone
      church: $church
      ordinanceTime: $ordinanceTime
    ) {
      _id
    }
  }
`;

export const UPDATE_PASTOR_PERSONAL_INFO = gql`
  mutation UpdatePastorPersonalInfo(
    $_id: ID!
    $name: String
    $cpf: String
    $maritalStatus: MaritalStatus
    $birthday: Date
  ) {
    updatePastorPersonalInfo(
      _id: $_id
      name: $name
      cpf: $cpf
      maritalStatus: $maritalStatus
      birthday: $birthday
    ) {
      _id
      name
      cpf
      maritalStatus
      birthday
    }
  }
`;
