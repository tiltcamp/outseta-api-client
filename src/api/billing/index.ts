import { Store } from '../../util/store';
import { Plans } from './plans';
import { Invoices } from './invoices';
import { Subscriptions } from './subscriptions';
import { PlanFamilies } from './plan-families';
import { Transactions } from './transactions';
import { Usage } from './usage';

export class Billing {
  public readonly invoices: Invoices;
  public readonly plans: Plans;
  public readonly planFamilies: PlanFamilies;
  public readonly subscriptions: Subscriptions;
  public readonly transactions: Transactions;
  public readonly usage: Usage;

  constructor(store: Store) {
    this.invoices = new Invoices(store);
    this.plans = new Plans(store);
    this.planFamilies = new PlanFamilies(store);
    this.subscriptions = new Subscriptions(store);
    this.transactions = new Transactions(store);
    this.usage = new Usage(store);
  }
}
