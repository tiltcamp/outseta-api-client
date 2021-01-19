import Request from '../../util/request';
import Store from '../../util/store';

export default class Plans {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

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

interface PlansResponse {
  metadata: Metadata;
  items: Item[];
}

interface Metadata {
  limit: number;
  offset: number;
  total: number;
}

interface Item {
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

interface PlanAddOn {
  IsUserSelectable: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}

interface PlanFamily {
  Name: string;
  IsActive: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}

