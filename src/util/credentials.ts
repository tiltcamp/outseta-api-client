interface Credentials {
  authorizationHeader: string;
  isReady: boolean;
}

export class ServerCredentials implements Credentials {
  apiKey?: string;
  secretKey?: string;

  constructor(apiKey?: string, secretKey?: string) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  get authorizationHeader(): string {
    if (!this.isReady)
      throw 'The API client was not initialized with API keys.';

    return `Outseta ${this.apiKey}:${this.secretKey}`;
  }

  get isReady(): boolean {
    return !!(this.apiKey && this.secretKey);
  }
}

export class UserCredentials implements Credentials {
  public accessToken?: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  get authorizationHeader(): string {
    if (!this.isReady)
      throw 'The API client doesn\'t have a user token. Please initialize the client with one or ' +
      'call profile.login() first.';

    return `bearer ${this.accessToken}`;
  }

  get isReady(): boolean {
    return !!this.accessToken;
  }
}
