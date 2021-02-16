import { Store } from '../../util/store';
import { Activities } from './activities';
import { Deals } from './deals';
import { People } from './people';
import { Accounts } from './accounts';

export class Crm {
  public readonly accounts: Accounts;
  public readonly activities: Activities;
  public readonly deals: Deals;
  public readonly people: People;

  constructor(store: Store) {
    this.accounts = new Accounts(store);
    this.activities = new Activities(store);
    this.deals = new Deals(store);
    this.people = new People(store);
  }
}
