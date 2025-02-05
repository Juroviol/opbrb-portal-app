import { gql } from '@apollo/client';

export const CREATE_PASTOR = gql`
  mutation CreatePastor(
    $file: Upload!
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
  ) {
    createPastor(
      file: $file
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
    ) {
      _id
    }
  }
`;
