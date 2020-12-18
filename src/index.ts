export default class OutsetaApiClient {
  readonly subdomain: string;

  readonly accessToken?: string;

  readonly apiKey?: string;
  readonly secretKey?: string;

  constructor({ subdomain, accessToken, apiKey, secretKey }: {
    subdomain: string,
    accessToken?: string,
    apiKey?: string,
    secretKey?: string
  }) {
    this.subdomain = subdomain;

    if (accessToken) {
      this.accessToken = accessToken;
    } else if (apiKey && secretKey) {
      this.apiKey = apiKey;
      this.secretKey = secretKey;
    } else {
      throw 'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).';
    }
  }

  get authorizationHeader(): string {
    if (this.accessToken) return `bearer ${this.accessToken}`;
    else return `Outseta ${this.apiKey}:${this.secretKey}`;
  }
}