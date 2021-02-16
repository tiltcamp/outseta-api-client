import { Store } from '../../util/store';
import { EmailListSubscriptions } from './email-list-subscriptions';

export class Marketing {
  public readonly emailListSubscriptions: EmailListSubscriptions;

  constructor(store: Store) {
    this.emailListSubscriptions = new EmailListSubscriptions(store);
  }
}
