import Credentials, { CredentialsParams } from '@src/util/credentials';

export default class OutsetaApiClient {
  readonly credentials: Credentials;
  readonly subdomain: string;

  constructor({ subdomain, accessToken, apiKey, secretKey }: Params) {
    this.subdomain = subdomain;
    this.credentials = new Credentials({accessToken, apiKey, secretKey});
  }
}

interface Params extends CredentialsParams {
  subdomain: string;
}
