export enum Role {
  ADMIN = 'ADMIN',
  PASTOR = 'PASTOR',
}

export enum Scope {
  CanListPastors = 'CanListPastors',
  CanDeletePastor = 'CanDeletePastor',
  CanDetailPastor = 'CanDetailPastor',
  CanEditAccountPersonalInfo = 'CanEditAccountPersonalInfo',
  CanEditAccountCredentials = 'CanEditAccountCredentials',
  CanEditAccountAddress = 'CanEditAccountAddress',
  CanEditAccountContactInfo = 'CanEditAccountContactInfo',
  CanEditAccountMinistry = 'CanEditAccountMinistry',
  CanEditAccountOrderCard = 'CanEditAccountOrderCard',
  CanApprovePastorDocumentationAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanRejectPastorDocumentationAnalysis = 'CanRejectPastorDocumentationAnalysis',
  CanApprovePastorFinancialAnalysis = 'CanApprovePastorFinancialAnalysis',
  CanRejectPastorFinancialAnalysis = 'CanRejectPastorFinancialAnalysis',
  CanDownloadPastorRecommendationLetter = 'CanDownloadPastorRecommendationLetter',
  CanDownloadPastorPaymentConfirmation = 'CanDownloadPastorPaymentConfirmation',
  CanDownloadPastorOrdinationMinutes = 'CanDownloadPastorOrdinationMinutes',
  CanDownloadPastorCpfRg = 'CanDownloadPastorCpfRg',
  CanListProfileScopes = 'CanListProfileScopes',
  CanCreateProfileScopes = 'CanCreateProfileScopes',
  CanEditProfileScopes = 'CanEditProfileScopes',
  CanDeleteProfileScopes = 'CanDeleteProfileScopes',
  CanAssignProfileScopes = 'CanAssignProfileScopes',
}

export default interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  scopes: Scope[];
  pictureUrl?: string;
}
