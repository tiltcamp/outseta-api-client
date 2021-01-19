import Store from '../../util/store';
import Plans from './plans';

export default class Billing {
  public readonly plans: Plans;

  constructor(store: Store) {
    this.plans = new Plans(store);
  }
}
