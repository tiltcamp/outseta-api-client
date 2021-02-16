import { Deal } from '../../models/crm/deal';
import { DealPipelineStage } from '../../models/crm/deal-pipeline-stage';
import { List } from '../../models/wrappers/list';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Store } from '../../util/store';

export class Deals {
  static readonly DEFAULT_FIELDS = [
    '*'
  ].join(',');
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all deals:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.deals.getAll();
   * console.log(response);
   * ```
   *
   * Get all deals in a specific pipeline's stage:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const DealPipelineStage = {
   *   Uid: 'qNmdZA90'
   * };
   * const response = await client.crm.deals.getAll({ DealPipelineStage });
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @param options.DealPipelineStage Filter by pipeline stage.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    fields?: string,
    DealPipelineStage?: Required<Pick<DealPipelineStage, 'Uid'>>
  } = {}): Promise<List<Deal>> {
    const request = new Request(this.store, 'crm/deals')
      .withParams({ fields: options.fields ? options.fields : Deals.DEFAULT_FIELDS })
      .authenticateAsServer();
    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    if (options.DealPipelineStage) request.withParams({ 'DealPipelineStage.Uid': `${options.DealPipelineStage.Uid}` });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as List<Deal>;
  }

  /**
   * Get a specific deal.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.deals.get(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the deal to get.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(uid: string, options: {
    fields?: string
  } = {}): Promise<Deal> {
    const request = new Request(this.store, `crm/deals/${uid}`)
      .withParams({ fields: options.fields ? options.fields : Deals.DEFAULT_FIELDS })
      .authenticateAsServer();
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as Deal;
  }

  /**
   * Add a deal. Must include a name and the uid of a pipeline stage.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.deals.add({
   *   Name: 'Fancy New Deal',
   *   DealPipelineStage: {
   *     Uid: 'qNmdZA90'
   *   }
   * });
   * console.log(response);
   * ```
   *
   * @param deal The deal you would like to add.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async add(deal: DealAdd, options: {
    fields?: string
  } = {}): Promise<Deal | ValidationError<Deal>> {
    const request = new Request(this.store, 'crm/deals')
      .withParams({ fields: options.fields ? options.fields : Deals.DEFAULT_FIELDS })
      .authenticateAsServer()
      .withBody(deal);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Deal>;
    else if (response.ok)
      return await response.json() as Deal;
    else throw response;
  }

  /**
   * Make changes to a deal. Must include the uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.deals.update({
   *   Uid: 'Rm8pvym4',
   *   Name: 'Brand New Deal Name'
   * });
   * console.log(response);
   * ```
   *
   * @param deal The deal with its uid and any fields to be changed.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async update(deal: DealUpdate, options: {
    fields?: string
  } = {}): Promise<Deal | ValidationError<Deal>> {
    const request = new Request(this.store, `crm/deals/${deal.Uid}`)
      .withParams({ fields: options.fields ? options.fields : Deals.DEFAULT_FIELDS })
      .authenticateAsServer()
      .withBody(deal);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Deal>;
    else if (response.ok)
      return await response.json() as Deal;
    else throw response;
  }

  /**
   * Delete a specific deal by its uid.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.deals.delete(uid);
   * console.log(response);
   * ```
   *
   * @param uid The uid for the deal to delete.
   * @returns Null if deletion was successful.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async delete(uid: string): Promise<null> {
    const request = new Request(this.store, `crm/deals/${uid}`)
      .authenticateAsServer();
    const response = await request.delete();

    if (!response.ok) throw response;
    return null;
  }
}

export interface DealAdd extends Partial<Omit<Deal, 'Uid' | 'DealPipelineStage'>> {
  [key: string]: unknown;
  Name: string;
  DealPipelineStage: Required<Pick<DealPipelineStage, 'Uid'>>;
}

export type DealUpdate = Required<Pick<Deal, 'Uid'>> & Partial<Deal>;
