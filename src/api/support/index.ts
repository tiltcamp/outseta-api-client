import { Store } from '../../util/store';
import { Cases } from './cases';

export class Support {
  public readonly cases: Cases;

  constructor(store: Store) {
    this.cases = new Cases(store);
  }
}
