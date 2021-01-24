import Store from '../../util/store';

export default class People {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }
}
