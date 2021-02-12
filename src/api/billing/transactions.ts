import { Transaction } from '../../models/billing/transaction';
import { List } from '../../models/wrappers/list';
import { Request } from '../../util/request';
import { Store } from '../../util/store';

export class Transactions {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all transactions for a particular account by its uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company' });
   * const response = await client.billing.transactions.getAll(accountUid);
   * console.log(response);
   * ```
   *
   * @param accountUid The uid for the account to grab transactions from.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(accountUid: string): Promise<List<Transaction>> {
    const request = new Request(this.store, `billing/transactions/${accountUid}`).authenticateAsServer();
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Transaction>;
  }
}
