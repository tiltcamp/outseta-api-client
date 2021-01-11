import unfetch from 'isomorphic-unfetch';
import Credentials from '@src/util/credentials';

export default class Request {
  static credentials: Credentials;
  static baseUrl: string;

  private readonly fetch: (url: string, options: Options) => Promise<Response>;
  private _options: Options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  private url: URL;

  constructor(endpoint: string, fetch = unfetch.bind(window)) {
    this.fetch = fetch;
    while (endpoint.startsWith('/')) endpoint = endpoint.substring(1);
    this.url = new URL(`${Request.baseUrl}${endpoint}`);
  }

  authenticated(): this {
    this._options.headers['Authorization'] = Request.credentials.authorizationHeader;
    return this;
  }

  withParams(params: { [key: string]: string }): this {
    Object.keys(params).forEach(key => this.url.searchParams.append(key, params[key]));
    return this;
  }

  withBody(body: { [key: string]: string }): this {
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
    return this.fetch(this.url.toString(), this._options);
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'DELETE';

interface Options {
  method?: Method;
  headers: { [key: string]: string };
  credentials?: 'include';
  body?: string;
}
