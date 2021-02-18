import { SubscriptionAddOn } from '../../models/billing/subscription-add-on';
import { Store } from '../../util/store';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Subscription } from '../../models/billing/subscription';
import { Plan } from '../../models/billing/plan';
import { Account } from '../../models/crm/account';
import { BillingRenewalTerm } from '../../models/billing/billing-renewal-term';
import { List } from '../../models/wrappers/list';
import { ChargeSummary } from '../../models/billing/charge-summary';

export class Subscriptions {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all subscriptions from Outseta:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.getAll();
   * console.log(response);
   * ```
   *
   * Get all subscriptions for a particular account from Outseta:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const Account = {
   *   Uid: 'jW7GJVWq'
   * };
   * const response = await client.billing.subscriptions.getAll({ Account });
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.Account Get all subscriptions only for a particular account.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,Plan.*,Account.Uid'. Note: the shape of the returned object may not match the model
   *   in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    Account?: Required<Pick<Account, 'Uid'>>,
    limit?: number,
    offset?: number,
    fields?: string
  } = {}): Promise<List<Subscription>> {
    const request = new Request(this.store, 'billing/subscriptions').authenticateAsServer();

    if (options.Account) request.withParams({ 'Account.Uid': options.Account.Uid });
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    options.fields ? request.withParams({ fields: `${options.fields}` }) : request.withParams({
      fields: '*,Account.Uid,Plan.Uid'
    });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Subscription>;
  }

  /**
   * Get a specific subscription from Outseta:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.get(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid of the subscription to retrieve.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,Plan.*,Account.Uid'. Note: the shape of the returned object may not match the model
   *   in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(uid: string, options: {
    fields?: string
  } = {}): Promise<Subscription> {
    const request = new Request(this.store, `billing/subscriptions/${uid}`)
      .authenticateAsServer();

    options.fields ? request.withParams({ fields: `${options.fields}` }) : request.withParams({
      fields: '*,Account.Uid,Plan.Uid'
    });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as Subscription;
  }

  /**
   * Add a subscription to an account for the first time.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.add({
   *   Account: {
   *     Uid: accountUid
   *   },
   *   Plan: {
   *     Uid: planUid
   *   },
   *   BillingRenewalTerm: 1 // Monthly, 2 for Annually
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The subscription to add.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async add(subscription: SubscriptionAdd): Promise<Subscription | ValidationError<Subscription>> {
    const request = new Request(this.store, 'billing/subscriptions/firsttimesubscription')
      .authenticateAsServer()
      .withBody(subscription);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Subscription>;
    else if (response.ok)
      return await response.json() as Subscription;
    else throw response;
  }

  /**
   * Like `add`, but returns an Invoice object without actually saving any changes. Used to show the user what they
   * would be charged.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.previewAdd({
   *   Account: {
   *     Uid: accountUid
   *   },
   *   Plan: {
   *     Uid: planUid
   *   },
   *   BillingRenewalTerm: 1 // Monthly, 2 for Annually
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The subscription to preview charges for.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async previewAdd(subscription: SubscriptionAdd): Promise<ChargeSummary | ValidationError<Subscription>> {
    const request = new Request(this.store, 'billing/subscriptions/compute-charge-summary')
      .authenticateAsServer()
      .withBody(subscription);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Subscription>;
    else if (response.ok)
      return await response.json() as ChargeSummary;
    else throw response;
  }

  /**
   * Update an existing subscription.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.update({
   *   Uid: uid,
   *   Account: {
   *     Uid: accountUid
   *   },
   *   Plan: {
   *     Uid: planUid
   *   },
   *   SubscriptionAddOns: [],
   *   BillingRenewalTerm: 1 // Monthly, 2 for Annually
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The subscription to update.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async update(subscription: SubscriptionUpdate): Promise<Subscription | ValidationError<Subscription>> {
    const request = new Request(this.store, `billing/subscriptions/${subscription.Uid}/changesubscription`)
      .authenticateAsServer()
      .withBody(subscription);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Subscription>;
    else if (response.ok)
      return await response.json() as Subscription;
    else throw response;
  }

  /**
   * Like `update`, but returns an Invoice object without actually saving any changes. Used to show the user what they
   * would be charged.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.previewUpdate({
   *   Uid: uid,
   *   Account: {
   *     Uid: accountUid
   *   },
   *   Plan: {
   *     Uid: planUid
   *   },
   *   SubscriptionAddOns: [],
   *   BillingRenewalTerm: 1 // Monthly, 2 for Annually
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The subscription to update.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async previewUpdate(subscription: SubscriptionUpdate): Promise<ChargeSummary | ValidationError<Subscription>> {
    const request = new Request(this.store, `billing/subscriptions/${subscription.Uid}/changesubscriptionpreview`)
      .authenticateAsServer()
      .withBody(subscription);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Subscription>;
    else if (response.ok)
      return await response.json() as ChargeSummary;
    else throw response;
  }

  /**
   * Set the "subscription upgrade required" flag on the subscription.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.setSubscriptionUpgradeRequired({
   *   IsPlanUpgradeRequired: true,
   *   PlanUpgradeRequiredMessage: 'Usage too high',
   *   Uid: 'LmJMEYWP'
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The subscription with 'IsPlanUpgradeRequired' and a 'PlanUpgradeRequiredMessage' if desired.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async setSubscriptionUpgradeRequired(subscription: SubscriptionUpgradeRequired): Promise<Subscription | ValidationError<null>> {
    const request = new Request(this.store, `billing/subscriptions/${subscription.Uid}/setsubscriptionupgraderequired`)
      .authenticateAsServer()
      .withBody(subscription);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<null>;
    else if (response.ok)
      return await response.json() as Subscription;
    else throw response;
  }

  /**
   * Convert a trial into a subscription.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.changeTrialToSubscribed(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid of the subscription to convert to a subscription.
   * @returns Null if the response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async changeTrialToSubscribed(uid: string): Promise<null | ValidationError<Account>> {
    const request = new Request(this.store, `billing/subscriptions/${uid}/changetrialtosubscribed`)
      .authenticateAsServer();
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Account>;
    else if (response.ok)
      return null;
    else throw response;
  }
}

export interface SubscriptionAdd extends Partial<Omit<Subscription, 'Plan' | 'Account'>> {
  [key: string]: unknown;
  Plan: { Uid: string } & Partial<Plan>;
  BillingRenewalTerm: BillingRenewalTerm;
  Account: { Uid: string } & Partial<Account>;
}

export interface SubscriptionUpdate extends Partial<SubscriptionAdd> {
  [key: string]: unknown;
  Uid: string;
  SubscriptionAddOns: SubscriptionAddOn[];
}

export interface SubscriptionUpgradeRequired extends Partial<Subscription> {
  [key: string]: unknown;
  Uid: string;
  IsPlanUpgradeRequired: boolean;
  PlanUpgradeRequiredMessage?: string;
}
