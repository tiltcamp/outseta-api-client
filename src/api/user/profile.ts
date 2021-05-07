import { Request } from '../../util/request';
import { Store } from '../../util/store';
import { Person } from '../../models/crm/person';
import { ValidationError } from '../../models/wrappers/validation-error';

export class Profile {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get the profile belonging to the provided user's access token.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   accessToken: jwt_user_token
   * });
   * const response = await client.user.profile.get();
   * console.log(response);
   * ```
   *
   * @param options.fields Not all fields on the model are returned by default - you can request specific fields with a
   *   string that looks something like '*,Account.*'. Note: the shape of the returned object may not match the model in
   *   this library if this string does not start with '*' as shown.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(options: {
    fields?: string
  } = {}): Promise<Person> {
    const request = new Request(this.store, 'profile').authenticateAsUser();
    if (options.fields) request.withParams({ fields: options.fields });

    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as Person;
  }

  /**
   * Update the profile belonging to the provided user's uid and access token.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   accessToken: jwt_user_token
   * });
   * const response = await client.user.profile.update({
   *   Uid: 'DQ2DyknW',
   *   FirstName: 'Jane',
   *   LastName: 'Doe'
   * });
   * console.log(response);
   * ```
   *
   * @param profile The profile fields and values to update. Must include the user's uid.
   * @returns The response body if response status OK, or response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async update(profile: ProfileUpdate): Promise<Person | ValidationError<Person>> {
    const request = new Request(this.store, 'profile')
      .authenticateAsUser()
      .withBody(profile);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<Person>;
    else if (response.ok)
      return await response.json() as Person;
    else throw response;
  }
}

export interface ProfileUpdate extends Partial<Person> {
  [key: string]: unknown;
  Uid: string;
}
