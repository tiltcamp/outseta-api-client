import Request from '../../util/request';
import Store from '../../util/store';
import ValidationError from '../../models/validation-error';
import UserProfileModel from '../../models/user-profile';

export default class Password {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Change the password belonging to the provided user's access token.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   accessToken: jwt_user_token
   * });
   * const response = await client.user.password.update(existingPassword, newPassword);
   * console.log(response);
   * ```
   *
   * @returns Null if response status OK, or the response body with validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" or non-"400" status, the whole response object will be thrown.
   */
  public async update(existingPassword: string, newPassword: string): Promise<null | ValidationError<UserProfileModel>> {
    const request = new Request(this.store, 'profile/password')
      .authenticateAsUser()
      .withBody({
        ExistingPassword: existingPassword,
        NewPassword: newPassword
      });
    const response = await request.put();

    if (response.status === 400)
      return await response.json() as ValidationError<UserProfileModel>;
    else if (response.ok)
      return null;
    else throw await response;
  }
}
