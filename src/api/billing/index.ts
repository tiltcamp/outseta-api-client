import Store from '../../util/store';
import Plans from './plans';
import Subscriptions from './subscriptions';

export default class Billing {
  public readonly plans: Plans;
  public readonly subscriptions: Subscriptions;

  constructor(store: Store) {
    this.plans = new Plans(store);
    this.subscriptions = new Subscriptions(store);
  }
}
