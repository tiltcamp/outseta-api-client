import { Store } from '../../util/store';
import { List } from '../../models/wrappers/list';
import { Account } from '../../models/crm/account';
import { Request } from '../../util/request';
import { AccountStage } from '../../models/crm/account-stage';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Subscription } from '../../models/billing/subscription';

export class Accounts {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all accounts in the Outseta CRM.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.getAll();
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.accountStage Filter the results to only users in this account stage.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,PersonAccount.*,PersonAccount.Person.Uid'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    accountStage?: AccountStage,
    fields?: string
  } = {}): Promise<List<Account>> {
    const request = new Request(this.store, 'crm/accounts')
      .authenticateAsServer()
      .withParams({
        fields: options.fields ? options.fields : '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    if (options.accountStage) request.withParams({ AccountStage: `${options.accountStage}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Account>;
  }

  /**
   * Get a specific account in the Outseta CRM by its uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.get(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the account to get.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,PersonAccount.*,PersonAccount.Person.Uid'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(uid: string, options: {
    fields?: string
  } = {}): Promise<Account> {
    const request = new Request(this.store, `crm/accounts/${uid}`)
      .authenticateAsServer()
      .withParams({
        fields: options.fields ? options.fields : '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as Account;
  }

  /**
   * Add an account to the CRM. Must include a name.
   *
   * ```typescript
   * import { AccountStage } from 'outseta-api-client/dist/models/crm/account-stage';
   *
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.add({
   *   Name: 'TiltCamp',
   *   AccountStage: AccountStage.Trialing
   * });
   * console.log(response);
   * ```
   *
   * For adding a new person with the account:
   * ```typescript
   * const response = await client.crm.accounts.add({
   *   Name: 'TiltCamp',
   *   AccountStage: AccountStage.Trialing
   *   PersonAccount: [{
   *     Person: {
   *       Email: 'hello@tiltcamp.com'
   *     },
   *     IsPrimary: true
   *   }]
   * });
   * ```
   *
   * For adding an existing person with the account:
   * ```typescript
   * const response = await client.crm.accounts.add({
   *   Name: 'TiltCamp',
   *   AccountStage: AccountStage.Trialing
   *   PersonAccount: [{
   *     Person: {
   *       Uid: 'L9P6gepm'
   *     },
   *     IsPrimary: true
   *   }]
   * });
   * ```
   *
   * @param account The details for the account to add.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,PersonAccount.*,PersonAccount.Person.Uid'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async add(account: AccountAdd, options: {
    fields?: string
  } = {}): Promise<Account | ValidationError<Account>> {
    const request = new Request(this.store, 'crm/accounts')
      .authenticateAsServer()
      .withBody(account)
      .withParams({
        fields: options.fields ? options.fields : '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Account>;
    else if (response.ok)
      return await response.json() as Account;
    else throw response;
  }

  /**
   * Update an account in the CRM. Must include its uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.update({
   *   Uid: 'DQ2DyknW',
   *   Name: 'New Name for TiltCamp'
   * });
   * console.log(response);
   * ```
   *
   * @param account The account fields and values to update. Must include the account's uid.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,PersonAccount.*,PersonAccount.Person.Uid'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async update(account: AccountUpdate, options: {
    fields?: string
  } = {}): Promise<Account | ValidationError<Account>> {
    const request = new Request(this.store, `crm/accounts/${account.Uid}`)
      .authenticateAsServer()
      .withBody(account)
      .withParams({
        fields: options.fields ? options.fields : '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Account>;
    else if (response.ok)
      return await response.json() as Account;
    else throw response;
  }

  /**
   * Cancel a subscribed account.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.cancel({
   *   CancelationReason: 'I am cancelling because ...',
   *   Comment: 'Insert comments here',
   *   Account: {
   *     Uid: 'BWz87NQE'
   *   }
   * });
   * console.log(response);
   * ```
   *
   * @param cancellation The cancellation object. Must include the account's uid.
   * @returns Null if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async cancel(cancellation: AccountCancellation): Promise<null | ValidationError<Account>> {
    const request = new Request(this.store, `crm/accounts/cancellation/${cancellation.Account.Uid}`)
      .authenticateAsServer()
      .withBody(cancellation);

    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Account>;
    else if (response.ok)
      return null;
    else throw response;
  }

  /**
   * Delete a specific account in the Outseta CRM by its uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.cancel(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the account to delete.
   * @returns Null if deletion was successful.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async delete(uid: string): Promise<null> {
    const request = new Request(this.store, `crm/accounts/${uid}`).authenticateAsServer();
    const response = await request.delete();

    if (!response.ok) throw response;
    return null;
  }

  /**
   * Set the trial expiration to a particular date. Meant for extension, but seems to also work for
   * shortening a trial period.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.extendTrial(uid, new Date('01/01/2021'));
   * console.log(response);
   * ```
   *
   * @param uid The uid for the account to edit.
   * @param date The date to set the trial expiration to.
   * @returns Null if deletion was successful, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async extendTrial(uid: string, date: Date): Promise<null | ValidationError<Subscription>> {
    const request = new Request(this.store, `crm/accounts/${uid}/extend-trial`)
      .authenticateAsServer()
      .withBody({
        ToDate: date
      });
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Subscription>;
    else if (response.ok)
      return null;
    else throw response;
  }

  /**
   * Removes the "cancellation" flag from an account with a subscription that is scheduled to expire.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.removeCancellation(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the account to "uncancel".
   * @returns Null if deletion was successful, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async removeCancellation(uid: string): Promise<null | ValidationError<Account>> {
    const request = new Request(this.store, `crm/accounts/${uid}/remove-cancellation`)
      .authenticateAsServer();
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Account>;
    else if (response.ok)
      return null;
    else throw response;
  }

  /**
   * Immediately cancel an account's subscription by "expiring" it *now*. 
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.accounts.expireCurrentSubscription(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the account to expire.
   * @returns Null if deletion was successful, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async expireCurrentSubscription(uid: string): Promise<null | ValidationError<Subscription>> {
    const request = new Request(this.store, `crm/accounts/${uid}/expire-current-subscription`)
      .authenticateAsServer();
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Subscription>;
    else if (response.ok)
      return null;
    else throw response;
  }
}

export interface AccountAdd extends Partial<Account> {
  [key: string]: unknown;
  Name: string;
  AccountStage: AccountStage;
}

export interface AccountUpdate extends Partial<Account> {
  [key: string]: unknown;
  Uid: string;
}

export interface AccountCancellation {
  [key: string]: unknown;
  CancelationReason?: string;
  Comment?: string;
  Account: AccountUpdate;
}
