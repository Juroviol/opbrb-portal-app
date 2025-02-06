export enum Role {
  ADMIN = 'ADMIN',
  PASTOR = 'PASTOR',
}

export default interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
}
