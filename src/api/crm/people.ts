import { Store } from '../../util/store';
import { Person } from '../../models/crm/person';
import { Request } from '../../util/request';
import { List } from '../../models/wrappers/list';
import { ValidationError } from '../../models/wrappers/validation-error';

export class People {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all people in the Outseta CRM.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.people.getAll();
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number
  } = {}): Promise<List<Person>> {
    const request = new Request(this.store, 'crm/people').authenticateAsServer();
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Person>;
  }

  /**
   * Get a specific person in the Outseta CRM by their uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.people.get(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the person to get.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(uid: string): Promise<Person> {
    const request = new Request(this.store, `crm/people/${uid}`).authenticateAsServer();
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as Person;
  }

  /**
   * Add a person to the CRM. Must include an email address.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.people.add({
   *   Email: 'hello@tiltcamp.com'
   * });
   * console.log(response);
   * ```
   *
   * @param person The details for the person to add.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async add(person: PersonAdd): Promise<Person | ValidationError<Person>> {
    const request = new Request(this.store, 'crm/people')
      .authenticateAsServer()
      .withBody(person);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Person>;
    else if (response.ok)
      return await response.json() as Person;
    else throw response;
  }

  /**
   * Update a person in the CRM. Must include their uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.people.update({
   *   Uid: 'DQ2DyknW',
   *   Email: 'hello@tiltcamp.com'
   * });
   * console.log(response);
   * ```
   *
   * @param person The profile fields and values to update. Must include the user's uid.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async update(person: PersonUpdate): Promise<Person | ValidationError<Person>> {
    const request = new Request(this.store, `crm/people/${person.Uid}`)
      .authenticateAsServer()
      .withBody(person);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Person>;
    else if (response.ok)
      return await response.json() as Person;
    else throw response;
  }

  /**
   * Delete a specific person in the Outseta CRM by their uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.people.delete(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the person to delete.
   * @returns Null if deletion was successful.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async delete(uid: string): Promise<null> {
    const request = new Request(this.store, `crm/people/${uid}`).authenticateAsServer();
    const response = await request.delete();

    if (!response.ok) throw response;
    return null;
  }
}

export interface PersonAdd extends Partial<Person> {
  [key: string]: unknown;
  Email: string;
}

export interface PersonUpdate extends Partial<Person> {
  [key: string]: unknown;
  Uid: string;
}
