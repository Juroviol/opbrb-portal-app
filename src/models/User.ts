export enum Role {
  ADMIN = 'ADMIN',
  PASTOR = 'PASTOR',
}

export enum Scope {
  CanListPastors = 'CanListPastors',
  CanDeletePastor = 'CanDeletePastor',
  CanDetailPastor = 'CanDetailPastor',
  CanApprovePastorDocumentationAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanRejectPastorDocumentationAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanApprovePastorFinancialAnalysis = 'CanApprovePastorDocumentationAnalysis',
  CanRejectPastorFinancialAnalysis = 'CanRejectPastorFinancialAnalysis',
  CanDownloadPastorRecommendationLetter = 'CanDownloadPastorRecommendationLetter',
  CanDownloadPastorPaymentConfirmation = 'CanDownloadPastorPaymentConfirmation',
}

export default interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  scopes: Scope[];
}
