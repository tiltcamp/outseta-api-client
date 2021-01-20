import { ServerCredentials, UserCredentials } from './util/credentials';
import Store from './util/store';
import User from './api/user';
import Billing from './api/billing';

export default class OutsetaApiClient {
  public readonly user: User;
  public readonly billing: Billing;

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
  }
}
