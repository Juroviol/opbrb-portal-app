import { gql } from '@apollo/client';

export const GET_PASTORS = gql`
  query GetPastors($page: Int!, $size: Int!) {
    pastors(page: $page, size: $size) {
      total
      docs {
        _id
        name
        church
        createdAt
        cellPhone
        status
        pictureUrl
      }
    }
  }
`;

export const GET_PASTORS_NAME = gql`
  query GetPastorsName($page: Int!, $size: Int!, $name: String) {
    pastors(page: $page, size: $size, name: $name) {
      total
      docs {
        _id
        name
      }
    }
  }
`;

export const GET_PASTOR = gql`
  query GetPastor($_id: ID!) {
    pastor(_id: $_id) {
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
      ordinationMinutesUrl
      cpfRgUrl
      scopes
      pictureUrl
      analysis {
        reason
        author
        approved
        date
        type
      }
    }
  }
`;

export const GET_PASTOR_PERSONAL_INFO = gql`
  query GetPastor($_id: ID!) {
    pastor(_id: $_id) {
      name
      cpf
      birthday
      maritalStatus
    }
  }
`;

export const GET_PASTOR_ADDRESS_INFO = gql`
  query GetPastor($_id: ID!) {
    pastor(_id: $_id) {
      street
      number
      city
      state
      district
      zipCode
    }
  }
`;

export const GET_PASTOR_ANALYSIS_HISTORY = gql`
  query GetPastor($_id: ID!) {
    pastor(_id: $_id) {
      analysis {
        reason
        author
        approved
        date
        type
      }
    }
  }
`;

export const GET_PASTOR_CONTACT_INFO = gql`
  query GetPastor($_id: ID!) {
    pastor(_id: $_id) {
      cellPhone
      email
    }
  }
`;

export const GET_PASTOR_MINISTRY_INFO = gql`
  query GetPastor($_id: ID!) {
    pastor(_id: $_id) {
      church
      ordinanceTime
      recommendationLetterUrl
      paymentConfirmationUrl
      ordinationMinutesUrl
      cpfRgUrl
    }
  }
`;

export const CREATE_PASTOR = gql`
  mutation CreatePastor(
    $fileLetter: Upload
    $filePaymentConfirmation: Upload
    $fileOrdinationMinutes: Upload
    $filePicture: Upload
    $fileCpfRg: Upload
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
      fileOrdinationMinutes: $fileOrdinationMinutes
      filePicture: $filePicture
      fileCpfRg: $fileCpfRg
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

export const DELETE_PASTOR = gql`
  mutation DeletePastor($_id: ID!) {
    deletePastor(_id: $_id)
  }
`;

export const UPDATE_PASTOR_PERSONAL_INFO = gql`
  mutation UpdatePastorPersonalInfo(
    $_id: ID!
    $name: String!
    $cpf: String!
    $maritalStatus: MaritalStatus!
    $birthday: Date!
  ) {
    updatePastor(
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

export const UPDATE_PASTOR_ADDRESS = gql`
  mutation UpdatePastorAddress(
    $_id: ID!
    $zipCode: String!
    $street: String!
    $district: String!
    $city: String!
    $state: String!
  ) {
    updatePastor(
      _id: $_id
      zipCode: $zipCode
      street: $street
      district: $district
      city: $city
      state: $state
    ) {
      _id
      zipCode
      street
      district
      city
      state
    }
  }
`;

export const UPDATE_PASTOR_CONTACT_INFO = gql`
  mutation UpdatePastorContactInfo(
    $_id: ID!
    $cellPhone: String!
    $email: String!
  ) {
    updatePastor(_id: $_id, cellPhone: $cellPhone, email: $email) {
      _id
      cellPhone
      email
    }
  }
`;

export const UPDATE_PASTOR_MINISTRY_INFO = gql`
  mutation UpdatePastorMinistryInfo(
    $_id: ID!
    $church: String!
    $ordinanceTime: Int!
    $fileLetter: Upload
    $filePaymentConfirmation: Upload
    $fileOrdinationMinutes: Upload
    $fileCpfRg: Upload
  ) {
    updatePastor(
      _id: $_id
      church: $church
      ordinanceTime: $ordinanceTime
      fileLetter: $fileLetter
      filePaymentConfirmation: $filePaymentConfirmation
      fileOrdinationMinutes: $fileOrdinationMinutes
      fileCpfRg: $fileCpfRg
    ) {
      _id
      recommendationLetterUrl
      paymentConfirmationUrl
      ordinationMinutesUrl
      cpfRgUrl
    }
  }
`;

export const UPDATE_PASTOR_ORDER_CARD = gql`
  mutation UpdatePastorOrderCard($_id: ID!, $filePicture: Upload) {
    updatePastor(_id: $_id, filePicture: $filePicture) {
      _id
      pictureUrl
    }
  }
`;

export const UPDATE_PASTOR_CREDENTIALS = gql`
  mutation UpdatePastorMinistryInfo(
    $_id: ID!
    $password: String!
    $newPassword: String!
  ) {
    updatePastor(_id: $_id, password: $password, newPassword: $newPassword) {
      _id
      password
    }
  }
`;

export const UPDATE_PASTOR_SCOPES = gql`
  mutation UpdatePastorScopes($_id: ID!, $scopes: [Scope!]!) {
    updatePastor(_id: $_id, scopes: $scopes) {
      _id
      scopes
    }
  }
`;

export const APPROVE_PASTOR_ANALYSIS = gql`
  mutation ApprovePastorAnalysis($_id: ID!, $type: AnalysisType!) {
    approvePastorAnalysis(_id: $_id, type: $type)
  }
`;

export const CREATE_PASTOR_PENDING_ITEM_ANALYSIS = gql`
  mutation CreatePastorPendingItemAnalysis(
    $_id: ID!
    $type: AnalysisType!
    $reason: String!
  ) {
    createPastorPendingItemAnalysis(_id: $_id, type: $type, reason: $reason)
  }
`;
