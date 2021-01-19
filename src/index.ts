import { ServerCredentials, UserCredentials } from '@src/util/credentials';
import Store from '@src/util/store';
import Billing from '@src/api/billing';

export default class OutsetaApiClient {
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

    this.billing = new Billing(store);
  }
}
