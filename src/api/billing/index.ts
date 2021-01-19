import Store from '@src/util/store';
import Plans from '@src/api/billing/plans';

export default class Billing {
  public readonly plans: Plans;

  constructor(store: Store) {
    this.plans = new Plans(store);
  }
}
