import { PlanFamily } from '../../models/billing/plan-family';
import { Request } from '../../util/request';
import { Store } from '../../util/store';
import { List } from '../../models/wrappers/list';

export class PlanFamilies {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all available plan families.
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company' });
   * const response = await client.billing.planFamilies.getAll();
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number
  } = {}): Promise<List<PlanFamily>> {
    const request = new Request(this.store, 'billing/planfamilies');
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<PlanFamily>;
  }
}
