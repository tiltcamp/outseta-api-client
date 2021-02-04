import Store from '../../util/store';
import List from '../../models/wrappers/list';
import AccountModel from '../../models/crm/account';
import Request from '../../util/request';
import { AccountStage } from '../../models/crm/account-stage';
import ValidationError from '../../models/wrappers/validation-error';

export default class Accounts {
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
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    accountStage?: AccountStage
  } = {}): Promise<List<AccountModel>> {
    const request = new Request(this.store, 'crm/accounts')
      .authenticateAsServer()
      .withParams({
        fields: '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    if (options.accountStage) request.withParams({ AccountStage: `${options.accountStage}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<AccountModel>;
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
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(uid: string): Promise<AccountModel> {
    const request = new Request(this.store, `crm/accounts/${uid}`)
      .authenticateAsServer()
      .withParams({
        fields: '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as AccountModel;
  }

  /**
   * Add an account to the CRM. Must include a name.
   *
   * ```typescript
   * import { AccountStage } from 'outseta-api-client/models/crm/account-stage';
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
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async add(account: AccountAdd): Promise<AccountModel | ValidationError<AccountModel>> {
    const request = new Request(this.store, 'crm/accounts')
      .authenticateAsServer()
      .withBody(account)
      .withParams({
        fields: '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<AccountModel>;
    else if (response.ok)
      return await response.json() as AccountModel;
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
   * const response = await client.crm.people.update({
   *   Uid: 'DQ2DyknW',
   *   Name: 'New Name for TiltCamp'
   * });
   * console.log(response);
   * ```
   *
   * @param account The account fields and values to update. Must include the account's uid.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async update(account: AccountUpdate): Promise<AccountModel | ValidationError<AccountModel>> {
    const request = new Request(this.store, `crm/accounts/${account.Uid}`)
      .authenticateAsServer()
      .withBody(account)
      .withParams({
        fields: '*,PersonAccount.*,PersonAccount.Person.Uid'
      });
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<AccountModel>;
    else if (response.ok)
      return await response.json() as AccountModel;
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
  public async cancel(cancellation: AccountCancellation): Promise<null | ValidationError<AccountModel>> {
    const request = new Request(this.store, `crm/accounts/cancellation/${cancellation.Account.Uid}`)
      .authenticateAsServer()
      .withBody(cancellation);

    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<AccountModel>;
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
}

export interface AccountAdd extends Partial<AccountModel> {
  [key: string]: unknown;
  Name: string;
  AccountStage: AccountStage;
}

export interface AccountUpdate extends Partial<AccountModel> {
  [key: string]: unknown;
  Uid: string;
}

export interface AccountCancellation {
  [key: string]: unknown;
  CancelationReason?: string;
  Comment?: string;
  Account: AccountUpdate;
}
