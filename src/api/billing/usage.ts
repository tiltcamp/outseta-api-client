import { Account } from '../../models/crm/account';
import { UsageItem } from '../../models/billing/usage-item';
import { List } from '../../models/wrappers/list';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Store } from '../../util/store';
import { SubscriptionAddOn } from '../../models/billing/subscription-add-on';

export class Usage {
  static readonly DEFAULT_FIELDS = [
    '*',
    'Invoice.Uid',
    'SubscriptionAddOn.*',
    'SubscriptionAddOn.Subscription.Uid',
    'SubscriptionAddOn.Subscription.Account.Uid',
    'SubscriptionAddOn.AddOn.Uid'
  ].join(',');
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all usage:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.usage.getAll();
   * console.log(response);
   * ```
   *
   * Get all usage for a particular account:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const Account = {
   *   Uid: 'jW7GJVWq'
   * };
   * const response = await client.billing.usage.getAll({ Account });
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.Account Get all usage for a particular account.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,SubscriptionAddOn.Subscription.Uid'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    fields?: string,
    Account?: Required<Pick<Account, 'Uid'>>
  } = {}): Promise<List<UsageItem>> {
    const request = new Request(this.store, 'billing/usage')
      .withParams({ fields: options.fields ? options.fields : Usage.DEFAULT_FIELDS })
      .authenticateAsServer();

    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    if (options.Account) request.withParams({ 'SubscriptionAddOn.Subscription.Account.Uid': `${options.Account.Uid}` });

    const response = await request.get();

    if (response.ok) return await response.json() as List<UsageItem>;
    else throw response;
  }

  /**
   * Record usage to an account's subscription.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.usage.add({
   *   UsageDate: new Date("2021-01-01T08:00:00.000Z"),
   *   Amount: 10,
   *   SubscriptionAddOn: {
   *     Uid: "z9MKvMm4"
   *   }
   * });
   * console.log(response);
   * ```
   *
   * @param usage The usage to log to Outseta. `SubscriptionAddOn` can be located in the `Subscription` model for an `Account`.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,SubscriptionAddOn.Subscription.Uid'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async add(usage: UsageAdd, options: {
    fields?: string
  } = {}): Promise<UsageItem | ValidationError<UsageItem>> {
    const request = new Request(this.store, 'billing/usage')
      .authenticateAsServer()
      .withParams({ fields: options.fields ? options.fields : Usage.DEFAULT_FIELDS })
      .withBody(usage);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<UsageItem>;
    else if (response.ok)
      return await response.json() as UsageItem;
    else throw response;
  }
}

export interface UsageAdd extends Partial<Omit<UsageItem, 'SubscriptionAddOn'>> {
  [key: string]: unknown;
  Amount: number;
  SubscriptionAddOn: Required<Pick<SubscriptionAddOn, 'Uid'>> & Partial<SubscriptionAddOn>
  UsageDate: Date;
}
