import { Person } from '../../models/crm/person';
import { Case } from '../../models/support/case';
import { CaseHistory } from '../../models/support/case-history';
import { CaseSource } from '../../models/support/case-source';
import { List } from '../../models/wrappers/list';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Store } from '../../util/store';

export class Cases {
  static readonly DEFAULT_FIELDS = [
    '*'
  ].join(',');
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all support cases:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.support.cases.getAll();
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the
   *   returned object may not match the model in this library if this string does not start with '*' as shown.
   * @param options.FromPerson Filter cases by person.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    fields?: string,
    FromPerson?: Required<Pick<Person, 'Uid'> | Pick<Person, 'Email'>> & Partial<Person>
  } = {}): Promise<List<Case>> {
    const request = new Request(this.store, 'support/cases')
      .withParams({ fields: options.fields ? options.fields : Cases.DEFAULT_FIELDS })
      .authenticateAsServer();
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });

    if (options.FromPerson?.Uid) request.withParams({ 'FromPerson.Uid': options.FromPerson.Uid });
    else if (options.FromPerson?.Email) request.withParams({ 'FromPerson.Email': options.FromPerson.Email });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Case>;
  }

  /**
   * Add a new support case.
   *
   * ```typescript
   * import { CaseSource } from 'outseta-api-client/dist/models/support/case-source';
   *
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.support.cases.add({
   *   Subject: 'Test Case 1',
   *   Body: 'This is the initial message that opened the case',
   *   FromPerson: {
   *     Uid: 'dQGn2ozm'
   *   },
   *   Source: CaseSource.Website
   * });
   * console.log(response);
   * ```
   *
   * @param newCase The case to add.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @param options.sendAutoResponder Whether or not to send the customer the "your ticket has been received" email. Defaults
   *   to true.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async add(newCase: CaseAdd, options: {
    fields?: string,
    sendAutoResponder?: boolean
  } = {}): Promise<Case | ValidationError<Case>> {
    const request = new Request(this.store, 'support/cases')
      .withParams({ fields: options.fields ? options.fields : Cases.DEFAULT_FIELDS })
      .authenticateAsServer()
      .withBody(newCase);

    if (options.sendAutoResponder !== undefined)
      request.withParams({ sendAutoResponder: `${options.sendAutoResponder}` });

    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Case>;
    else if (response.ok)
      return await response.json() as Case;
    else throw response;
  }

  /**
   * Add a reply from an agent to an existing case.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.support.cases.addReplyFromAgent({
   *   AgentName: 'Firstname Lastname',
   *   Case: {
   *     Uid: 'rmkyza9g'
   *   },
   *   Comment: 'This is a response comment'
   * });
   * console.log(response);
   * ```
   *
   * @param reply The reply from an agent to add to a case.
   * @returns Null if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async addReplyFromAgent(reply: SupportReply): Promise<null> {
    const request = new Request(this.store, `support/cases/${reply.Case.Uid}/replies`)
      .authenticateAsServer()
      .withBody(reply);

    const response = await request.post();

    if (response.ok) return null;
    else throw response;
  }

  /**
   * Add a reply from a customer to an existing case.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.support.cases.addReplyFromClient({
   *   Case: {
   *     Uid: 'rmkyza9g'
   *   },
   *   Comment: 'This is a response comment'
   * });
   * console.log(response);
   * ```
   *
   * @param reply The reply from the customer to add to a case.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async addReplyFromClient(reply: ClientReply): Promise<CaseHistory> {
    const request = new Request(this.store, `support/cases/${reply.Case.Uid}/clientresponse/${reply.Comment}`)
      .authenticateAsServer();

    const response = await request.post();

    if (response.ok)
      return await response.json() as CaseHistory;
    else throw response;
  }
}

export interface CaseAdd extends Partial<Omit<Case, 'FromPerson'>> {
  [key: string]: unknown;
  FromPerson: Required<Pick<Person, 'Uid'> | Pick<Person, 'Email'>> & Partial<Person>;
  Subject: string;
  Body: string;
  Source: CaseSource;
}

export interface SupportReply extends Partial<Omit<CaseHistory, 'Case'>> {
  [key: string]: unknown;
  AgentName: string;
  Case: Required<Pick<Case, 'Uid'>>;
  Comment: string;
}

export interface ClientReply extends Partial<Omit<CaseHistory, 'Case'>> {
  [key: string]: unknown;
  Case: Required<Pick<Case, 'Uid'>>;
  Comment: string;
}
