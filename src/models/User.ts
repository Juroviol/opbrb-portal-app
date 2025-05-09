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
  CanListAccountAnalysisHistory = 'CanListAccountAnalysisHistory',
  CanApprovePastorDocumentationAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanApprovePastorFinancialAnalysis = 'CanApprovePastorFinancialAnalysis',
  CanAddPendingItemAnalysis = 'CanAddPendingItemAnalysis',
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
  scopes: Scope[];
  pictureUrl?: string;
}
