import { Scope } from '@models/User.ts';

export default interface Profile {
  _id: string;
  name: string;
  scopes: Scope[];
}
