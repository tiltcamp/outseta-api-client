import Request from '../../util/request';
import Store from '../../util/store';
import PersonModel from '../../models/person';
import ValidationError from '../../models/wrappers/validation-error';

export default class Profile {
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
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(): Promise<PersonModel> {
    const request = new Request(this.store, 'profile').authenticateAsUser();
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as PersonModel;
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
  public async update(profile: ProfileUpdate): Promise<PersonModel | ValidationError<PersonModel>> {
    const request = new Request(this.store, 'profile')
      .authenticateAsUser()
      .withBody(profile);
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<PersonModel>;
    else if (response.ok)
      return await response.json() as PersonModel;
    else throw response;
  }
}

export interface ProfileUpdate extends Partial<PersonModel> {
  [key: string]: unknown;
  Uid: string;
}
