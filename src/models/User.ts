export enum Role {
  ADMIN = 'ADMIN',
}

export default interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
}
