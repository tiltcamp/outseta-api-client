import { Store } from '../../util/store';
import { Request } from '../../util/request';
import { Profile } from './profile';
import { Password } from './password';

export class User {
  public readonly password: Password;
  public readonly profile: Profile;

  private readonly store: Store;

  constructor(store: Store) {
    this.password = new Password(store);
    this.profile = new Profile(store);

    this.store = store;
  }

  /**
   * Get an access token for a user via their username and password. Even
   * if the API client was not initialized with a user access token,
   * performing this action will internally set the token if the login
   * is successful.
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company' });
   * const response = await client.user.login('username', 'password');
   * console.log(response.access_token);
   * ```
   *
   * @param username (usually an email address)
   * @param password
   * @returns The response body with the user's JWT token.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async login(username: string, password: string): Promise<LoginResponse> {
    const request = new Request(this.store, 'tokens').withBody({
      username,
      password,
      'grant_type': 'password',
      'client_id': 'outseta_auth_widget'
    });
    const response = await request.post();
    if (!response.ok) throw response;

    const responseBody = await response.json() as LoginResponse;

    this.store.userAuth.accessToken = responseBody.access_token;
    return responseBody;
  }

  /**
   * Get an access token for any user using the server's API key and secret.
   * Even if the API client was not initialized with a user access token,
   * performing this action will internally set the token if the login
   * is successful.
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company', apiKey: 'api_key', secretKey: 'api_secret' });
   * const response = await client.user.impersonate('username');
   * console.log(response.access_token);
   * ```
   *
   * @param username (usually an email address)
   * @returns The response body with the user's JWT token.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async impersonate(username: string): Promise<LoginResponse> {
    const request = new Request(this.store, 'tokens')
      .authenticateAsServer()
      .withBody({
        username,
        password: '',
        'grant_type': 'password',
        'client_id': 'outseta_auth_widget'
      });
    const response = await request.post();
    if (!response.ok) throw response;

    const responseBody = await response.json() as LoginResponse;

    this.store.userAuth.accessToken = responseBody.access_token;
    return responseBody;
  }
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}
