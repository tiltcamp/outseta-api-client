import Request from '../../util/request';
import Store from '../../util/store';

export default class Plans {
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
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number
  } = {}): Promise<PlansResponse> {
    const request = new Request(this.store, 'billing/plans');
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as PlansResponse;
  }
}

export interface PlansResponse {
  metadata: Metadata;
  items: Item[];
}

export interface Metadata {
  limit: number;
  offset: number;
  total: number;
}

export interface Item {
  Name: string;
  Description: string;
  PlanFamily: PlanFamily;
  IsQuantityEditable: boolean;
  MinimumQuantity: number;
  MonthlyRate: number;
  AnnualRate: number;
  SetupFee: number;
  IsTaxable: boolean;
  IsActive: boolean;
  TrialPeriodDays: number;
  UnitOfMeasure: string;
  PlanAddOns: PlanAddOn[];
  NumberOfSubscriptions: number;
  Uid: string;
  Created: Date;
  Updated: Date;
}

export interface PlanAddOn {
  IsUserSelectable: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}

export interface PlanFamily {
  Name: string;
  IsActive: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}

