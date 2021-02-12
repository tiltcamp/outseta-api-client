import { Person } from './person';
import { Account } from './account';

export interface PersonAccount {
  Person?: Person;
  Account?: Account;
  IsPrimary: boolean;
  Uid?: string;
  Created?: Date;
  Updated?: Date;
}
