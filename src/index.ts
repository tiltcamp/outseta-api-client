import { ServerCredentials, UserCredentials } from './util/credentials';
import Store from './util/store';
import User from './api/user';
import Billing from './api/billing';
import Crm from './api/crm';

export default class OutsetaApiClient {
  public readonly user: User;
  public readonly billing: Billing;
  public readonly crm: Crm;

  /**
   * Initializing without any keys:
   * ```typescript
   * import OutsetaApiClient from 'outseta-api-client';
   * const client = new OutsetaApiClient({subdomain: 'test-company'});
   * ```
   *
   * Initializing with server-side API keys:
   * ```typescript
   * import OutsetaApiClient from 'outseta-api-client';
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * ```
   *
   * Initializing with a user access token:
   * ```typescript
   * import OutsetaApiClient from 'outseta-api-client';
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   accessToken: jwt_user_token
   * });
   * ```
   * @param subdomain If your Outseta domain is `tiltcamp.outseta.com`, this would be `tiltcamp`
   * @param accessToken A user's access token (if available)
   * @param apiKey A server-side API key (if available)
   * @param secretKey A server-side API key secret (if available)
   */
  constructor({ subdomain, accessToken, apiKey, secretKey }: {
    subdomain: string;
    accessToken?: string;
    apiKey?: string;
    secretKey?: string;
  }) {
    const baseUrl = `https://${subdomain}.outseta.com/api/v1/`;
    const userAuth = new UserCredentials(accessToken);
    const serverAuth = new ServerCredentials(apiKey, secretKey);
    const store = new Store(baseUrl, userAuth, serverAuth);

    this.user = new User(store);
    this.billing = new Billing(store);
    this.crm = new Crm(store);
  }
}
