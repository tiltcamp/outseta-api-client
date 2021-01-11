import Request from '@src/util/request';
import Credentials, { CredentialsParams } from '@src/util/credentials';

export default class OutsetaApiClient {
  constructor({ subdomain, accessToken, apiKey, secretKey }: Params) {
    Request.baseUrl = `https://${subdomain}.outseta.com/api/v1/`;
    Request.credentials = new Credentials({accessToken, apiKey, secretKey});
  }
}

interface Params extends CredentialsParams {
  subdomain: string;
}
