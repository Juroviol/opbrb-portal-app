export enum Role {
  ADMIN = 'ADMIN',
  PASTOR = 'PASTOR',
}

export enum Scope {
  CanListPastors = 'CanListPastors',
  CanDeletePastor = 'CanDeletePastor',
  CanDetailPastor = 'CanDetailPastor',
  CanEditProfilePersonalInfo = 'CanEditProfilePersonalInfo',
  CanEditProfileCredentials = 'CanEditProfileCredentials',
  CanEditProfileAddress = 'CanEditProfileAddress',
  CanEditProfileContactInfo = 'CanEditProfileContactInfo',
  CanEditProfileMinistry = 'CanEditProfileMinistry',
  CanEditProfileOrderCard = 'CanEditProfileOrderCard',
  CanEditPastorFinancialAnalysis = 'CanEditPastorFinancialAnalysis',
  CanEditPastorDocumentationAnalysis = 'CanEditPastorDocumentationAnalysis',
  CanEditPastorRecommendationLetter = 'CanEditPastorRecommendationLetter',
  CanEditPastorPaymentConfirmation = 'CanEditPastorPaymentConfirmation',
  CanApprovePastorDocumentationAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanRejectPastorDocumentationAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanApprovePastorFinancialAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanRejectPastorFinancialAnalysis = 'CanRejectPastorFinancialAnalysis',
  CanDownloadPastorRecommendationLetter = 'CanDownloadPastorRecommendationLetter',
  CanDownloadPastorPaymentConfirmation = 'CanDownloadPastorPaymentConfirmation',
  CanDownloadPastorOrdinationMinutes = 'CanDownloadPastorOrdinationMinutes',
  CanDownloadPastorCpfRg = 'CanDownloadPastorCpfRg',
}

export default interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  scopes: Scope[];
  pictureUrl?: string;
}
