import { Store } from '../../util/store';
import { Plans } from './plans';
import { Invoices } from './invoices';
import { Subscriptions } from './subscriptions';
import { PlanFamilies } from './plan-families';

export class Billing {
  public readonly invoices: Invoices;
  public readonly plans: Plans;
  public readonly planFamilies: PlanFamilies;
  public readonly subscriptions: Subscriptions;

  constructor(store: Store) {
    this.invoices = new Invoices(store);
    this.plans = new Plans(store);
    this.planFamilies = new PlanFamilies(store);
    this.subscriptions = new Subscriptions(store);
  }
}
