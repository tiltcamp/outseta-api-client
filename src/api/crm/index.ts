import Store from '../../util/store';
import People from './people';

export default class Crm {
  public readonly people: People;

  constructor(store: Store) {
    this.people = new People(store);
  }
}
