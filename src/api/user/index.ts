import Store from '@src/util/store';
import Request from '@src/util/request';

export default class User {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Login as a user
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company' });
   * await client.user.login('username', 'password');
   * ```
   *
   * @param username The user's email
   * @param password The user's password
   * @returns The response body with the user's JWT token
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
   * Get an access token for any user using the server's API key and secret
   *
   * ```typescript
   * const client = new OutsetaApiClient({ subdomain: 'test-company', apiKey: 'api_key', secretKey: 'api_secret' });
   * await client.user.impersonate('username', 'password');
   * ```
   *
   * @param username The user's email
   * @returns The response body with the user's JWT token
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

interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}
