import { Store } from './store';

export class Request {
  private readonly store: Store;
  private _options: Options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  private url: URL;

  constructor(store: Store, endpoint: string) {
    this.store = store;
    while (endpoint.startsWith('/')) endpoint = endpoint.substring(1);
    this.url = new URL(`${store.baseUrl}${endpoint}`);
  }

  authenticateAsUser(): this {
    this._options.headers['Authorization'] = this.store.userAuth.authorizationHeader;
    return this;
  }

  authenticateAsUserPreferred(): this {
    if (this.store.userAuth.isReady) this.authenticateAsUser();
    else if (this.store.serverAuth.isReady) this.authenticateAsServer();

    return this;
  }

  authenticateAsServer(): this {
    this._options.headers['Authorization'] = this.store.serverAuth.authorizationHeader;
    return this;
  }

  authenticateAsServerPreferred(): this {
    if (this.store.serverAuth.isReady) this.authenticateAsServer();
    else if (this.store.userAuth.isReady) this.authenticateAsUser();

    return this;
  }

  withParams(params: { [key: string]: string }): this {
    Object.keys(params).forEach(key => this.url.searchParams.append(key, params[key]));
    return this;
  }

  withBody(body: Record<string, unknown>): this {
    if (this._options.body) {
      const existingBody = JSON.parse(this._options.body);
      body = Object.assign(existingBody, body);
    }

    this._options.body = JSON.stringify(body);
    return this;
  }

  get(): Promise<Response> {
    return this.execute('GET');
  }

  post(): Promise<Response> {
    return this.execute('POST');
  }

  put(): Promise<Response> {
    return this.execute('PUT');
  }

  patch(): Promise<Response> {
    return this.execute('PATCH');
  }

  delete(): Promise<Response> {
    return this.execute('DELETE');
  }

  private execute(method: Method): Promise<Response> {
    this._options.method = method;
    return fetch(this.url.toString(), this._options);
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'DELETE';

interface Options {
  method?: Method;
  headers: { [key: string]: string };
  credentials?: 'include';
  body?: string;
}
