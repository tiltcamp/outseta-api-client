import { PlanFamily } from '../../models/billing/plan-family';
import { Request } from '../../util/request';
import { Store } from '../../util/store';
import { List } from '../../models/wrappers/list';
import { Plan } from '../../models/billing/plan';

export class Plans {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all available plans.
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company' });
   * const response = await client.billing.plans.getAll();
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.PlanFamily Get all plans that belong to a specific plan family.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    PlanFamily?: Required<Pick<PlanFamily, 'Uid'>>
  } = {}): Promise<List<Plan>> {
    const request = new Request(this.store, 'billing/plans');
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    if (options.PlanFamily) request.withParams({ 'PlanFamily.Uid': options.PlanFamily.Uid });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Plan>;
  }
}
