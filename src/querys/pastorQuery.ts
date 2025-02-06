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

export const CREATE_PASTOR = gql`
  mutation CreatePastor(
    $fileLetter: Upload!
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
