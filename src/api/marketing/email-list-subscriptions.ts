import { Person } from '../../models/crm/person';
import { EmailList } from '../../models/marketing/email-list';
import { EmailListPerson } from '../../models/marketing/email-list-person';
import { List } from '../../models/wrappers/list';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Store } from '../../util/store';

export class EmailListSubscriptions {
  static readonly DEFAULT_FIELDS = [
    '*'
  ].join(',');
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all subscriptions to a list:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.marketing.emailListSubscriptions.getAll(listUid);
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the
   *   returned object may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(listUid: string, options: {
    limit?: number,
    offset?: number,
    fields?: string
  } = {}): Promise<List<EmailListPerson>> {
    const request = new Request(this.store, `email/lists/${listUid}/subscriptions`)
      .withParams({ fields: options.fields ? options.fields : EmailListSubscriptions.DEFAULT_FIELDS })
      // This endpoint throws an exception without an orderBy ¯\_(ツ)_/¯
      .withParams({ orderBy: 'SubscribedDate' })
      .authenticateAsServer();
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<EmailListPerson>;
  }

  /**
   * Add a subscriber to a list with a new person:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.marketing.emailListSubscriptions.add({
   *   EmailList: {
   *     Uid: 'ngWKYnQp'
   *   },
   *   Person: {
   *     Email: 'hello@tiltcamp.com'
   *   }
   * });
   * console.log(response);
   * ```
   *
   * Add a subscriber to a list with an existing person:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.marketing.emailListSubscriptions.add({
   *   EmailList: {
   *     Uid: 'ngWKYnQp'
   *   },
   *   Person: {
   *     Uid: 'DQ2DyknW'
   *   }
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The subscription to add.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the
   *   returned object may not match the model in this library if this string does not start with '*' as shown.
   * @returns Null if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async add(subscription: SubscriptionAdd, options: {
    fields?: string
  } = {}): Promise<null | ValidationError<Person>> {
    const request = new Request(this.store, `email/lists/${subscription.EmailList.Uid}/subscriptions`)
      .withParams({ fields: options.fields ? options.fields : EmailListSubscriptions.DEFAULT_FIELDS })
      .authenticateAsServer()
      .withBody(subscription);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Person>;
    else if (response.ok)
      return null;
    else throw response;
  }

  /**
   * Remove a specific subscriber from an email list.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.marketing.emailListSubscriptions.delete({
   *   EmailList: {
   *     Uid: 'ngWKYnQp'
   *   },
   *   Person: {
   *     Uid: 'wQXrBxWK'
   *   }
   * });
   * console.log(response);
   * ```
   *
   * @param subscription The 'EmailListPerson' object to delete.
   * @returns Null if deletion was successful.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async delete(subscription: SubscriptionDelete): Promise<null> {
    const request = new Request(
      this.store,
      `email/lists/${subscription.EmailList.Uid}/subscriptions/${subscription.Person.Uid}`
    ).authenticateAsServer();
    const response = await request.delete();

    if (!response.ok) throw response;
    return null;
  }
}

export interface SubscriptionAdd extends Partial<Omit<EmailListPerson, 'EmailList' | 'Person'>> {
  [key: string]: unknown;
  EmailList: Required<Pick<EmailList, 'Uid'>>;
  Person: Required<Pick<Person, 'Uid'>> | Required<Pick<Person, 'Email'>>;
}

export interface SubscriptionDelete extends Partial<Omit<EmailListPerson, 'EmailList' | 'Person'>> {
  [key: string]: unknown;
  EmailList: Required<Pick<EmailList, 'Uid'>>;
  Person: Required<Pick<Person, 'Uid'>>;
}
