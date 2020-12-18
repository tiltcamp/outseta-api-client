export default class Credentials {
  readonly accessToken?: string;

  readonly apiKey?: string;
  readonly secretKey?: string;

  constructor({ accessToken, apiKey, secretKey }: CredentialsParams) {
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

export interface CredentialsParams {
  accessToken?: string;
  apiKey?: string;
  secretKey?: string;
}