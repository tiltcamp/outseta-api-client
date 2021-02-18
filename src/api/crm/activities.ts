import { EntityType } from '../../models/shared/entity-type';
import { Activity } from '../../models/crm/activity';
import { ActivityType } from '../../models/crm/activity-type';
import { List } from '../../models/wrappers/list';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Store } from '../../util/store';

export class Activities {
  static readonly DEFAULT_FIELDS = [
    '*'
  ].join(',');
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get all activity:
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.activities.getAll();
   * console.log(response);
   * ```
   *
   * Get all activities for a particular account:
   * ```typescript
   * import { EntityType } from 'outseta-api-client/dist/models/shared/entity-type';
   *
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const account = {
   *   Uid: 'jW7GJVWq'
   * };
   * const response = await client.crm.activities.getAll({
   *   EntityType: EntityType.Account,
   *   EntityUid: account.Uid
   * });
   * console.log(response);
   * ```
   *
   * @param options.limit The number of results returned by the API.
   * @param options.offset For pagination; returns (limit) results after this value.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @param options.ActivityType Filter by activity type.
   * @param options.EntityType Filter by entity type.
   * @param options.EntityUid Filter by uid - should be used in conjunction with the EntityType filter.
   * @returns The response body if response status OK.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async getAll(options: {
    limit?: number,
    offset?: number,
    fields?: string,
    ActivityType?: ActivityType,
    EntityType?: EntityType,
    EntityUid?: string
  } = {}): Promise<List<Activity>> {
    const request = new Request(this.store, 'activities')
      .withParams({ fields: options.fields ? options.fields : Activities.DEFAULT_FIELDS })
      .authenticateAsServer();

    if (options.limit) request.withParams({ limit: `${options.limit}` });
    if (options.offset) request.withParams({ offset: `${options.offset}` });
    if (options.ActivityType) request.withParams({ ActivityType: `${options.ActivityType}` });
    if (options.EntityType) request.withParams({ EntityType: `${options.EntityType}` });
    if (options.EntityUid) request.withParams({ EntityUid: `${options.EntityUid}` });

    const response = await request.get();

    if (response.ok) return await response.json() as List<Activity>;
    else throw response;
  }

  /**
   * Record activity to an entity.
   *
   * ```typescript
   * import { EntityType } from 'outseta-api-client/dist/models/shared/entity-type';
   *
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.crm.activities.add({
   *   EntityType: EntityType.Account,
   *   EntityUid: 'jW7GJVWq',
   *   Title: 'Example custom activity',
   *   Description: 'Added a new custom activity'
   * });
   * console.log(response);
   * ```
   *
   * @param activity The activity to log to Outseta.
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   that looks something like '*,(field name here).(child field name here or * for all)'. Note: the shape of the returned object
   *   may not match the model in this library if this string does not start with '*' as shown.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async add(activity: ActivityAdd, options: {
    fields?: string
  } = {}): Promise<Activity | ValidationError<null>> {
    const request = new Request(this.store, 'activities/customactivity')
      .authenticateAsServer()
      .withParams({ fields: options.fields ? options.fields : Activities.DEFAULT_FIELDS })
      .withBody(activity);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<null>;
    else if (response.ok)
      return await response.json() as Activity;
    else throw response;
  }
}

export type ActivityAdd = Required<Pick<Activity, 'Title' | 'Description' | 'EntityType' | 'EntityUid'>> & Partial<Activity>;
