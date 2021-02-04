import Person from './person';
import Account from '../crm/account';

export default interface PersonAccount {
  Person?: Person;
  Account?: Account;
  IsPrimary: boolean;
  Uid?: string;
  Created?: Date;
  Updated?: Date;
}
