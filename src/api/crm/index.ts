import Store from '../../util/store';
import People from './people';
import Accounts from './accounts';

export default class Crm {
  public readonly people: People;
  public readonly accounts: Accounts;

  constructor(store: Store) {
    this.people = new People(store);
    this.accounts = new Accounts(store);
  }
}
