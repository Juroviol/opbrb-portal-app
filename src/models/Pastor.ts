import User from './User.ts';

export enum MaritalStatus {
  Married = 'Casado',
  Single = 'Solteiro',
  Widower = 'Viúvo',
}

export enum Status {
  APPROVED = 'Aprovado',
  ANALYSING = 'Em análise',
}

export default interface Pastor extends User {
  cpf: string;
  maritalStatus: MaritalStatus;
  birthday: Date;
  street: string;
  number: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  cellPhone: string;
  church: string;
  ordinanceTime: number;
  recommendationLetterUrl?: string;
  paymentConfirmationUrl?: string;
  ordinationMinutesUrl?: string;
  cpfRgUrl?: string;
  createdAt: string;
  status: Status;
}
