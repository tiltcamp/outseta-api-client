import Pretender, { ResponseHandler } from 'pretender';

import Request from '@src/util/request';
import Store from '@src/util/store';
import { ServerCredentials, UserCredentials } from '@src/util/credentials';

describe('Request', () => {
  let defaultFetch: typeof Request.fetch;
  let pretenderFetch: typeof Request.fetch;

  let server: Pretender;
  let store: Store;

  beforeAll(() => {
    store = new Store('https://test-company.outseta.com/api/', new UserCredentials(), new ServerCredentials());
    new Request(store, '');
    defaultFetch = Request.fetch;

    server = new Pretender();
    pretenderFetch = self.fetch;
  });

  beforeEach(() => {
    server.shutdown();

    store = new Store(
      'https://test-company.outseta.com/api/',
      new UserCredentials(),
      new ServerCredentials()
    );

    Request.fetch = pretenderFetch;
  });

  afterAll(() => {
    Request.fetch = defaultFetch;
  });

  describe('constructor', () => {
    it('uses unfetch by default', async () => {
      expect(Request.fetch.toString()).toBe(pretenderFetch.toString());
      expect(Request.fetch.toString()).not.toBe(defaultFetch.toString());

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Request.fetch = undefined;

      new Request(store, '/');
      expect(Request.fetch.toString()).toBe(defaultFetch.toString());
      expect(Request.fetch.toString()).not.toBe(pretenderFetch.toString());
    });
  });

  describe('get', () => {
    it('performs get request', async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function () {
        this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request(store, '/test_endpoint');
      const response = await request.get();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({message: 'Hello World'});
    });

    describe('authenticateAsUser', () => {
      it('performs get request with authorization header', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUser().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });
    });

    describe('authenticateAsUserPreferred', () => {
      it('uses user auth header when present', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        store.serverAuth.apiKey = 'example_key';
        store.serverAuth.secretKey = 'example_secret';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUserPreferred().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });

      it('uses server auth header when user token not present', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.serverAuth.apiKey = 'example_key';
        store.serverAuth.secretKey = 'example_secret';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUserPreferred().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });

      it('uses no auth if no keys present', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUserPreferred().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });
    });

    describe('authenticateAsServer', () => {
      it('performs get request with authorization header', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.serverAuth.apiKey = 'example_key';
        store.serverAuth.secretKey = 'example_secret';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsServer().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });
    });

    describe('authenticateAsServerPreferred', () => {
      it('uses server auth header when present', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.serverAuth.apiKey = 'example_key';
        store.serverAuth.secretKey = 'example_secret';
        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsServerPreferred().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });

      it('uses user auth header when server token not present', async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function () {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsServerPreferred().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({message: 'Hello World'});
      });
    });

    it('uses no auth if no keys present', async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      }
      server = new Pretender(function () {
        this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request(store, '/test_endpoint');
      const response = await request.authenticateAsServerPreferred().get();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({message: 'Hello World'});
    });
  });

  describe('post', () => {
    it('performs post request',  async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          204,
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function() {
        this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request(store, '/test_endpoint');
      const response = await request.post();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticateAsUser', () => {
      it('performs post request with authorization header',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUser().post();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withParams', () => {
      it('performs post request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({ 'testParam': 'hi there' });
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withParams({ 'testParam': 'hi there' }).post();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });

      it('retains previously added params and replaces existing params',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({
            'callOne': 'hi',
            'callTwo': 'hey',
            'replaceMe': 'hey'
          });
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint')
          .withParams({ 'callOne': 'hi', 'replaceMe': 'hello' });
        const response = await request.withParams({ 'callTwo': 'hey', 'replaceMe': 'hey' }).post();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withBody', () => {
      it('performs post request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({ 'testParam': 'hi there' });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withBody({ 'testParam': 'hi there' }).post();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });

      it('retains previously added params and replaces existing params',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({
            'callOne': 'hi',
            'callTwo': 'hey',
            'replaceMe': 'hey'
          });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint')
          .withBody({ 'callOne': 'hi', 'replaceMe': 'hello' });
        const response = await request.withBody({ 'callTwo': 'hey', 'replaceMe': 'hey' }).post();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withContentType', () => {
      it('performs post request with specified Content-Type header',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/x-www-form-urlencoded');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.post('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withContentType('application/x-www-form-urlencoded').post();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });
  });

  describe('put', () => {
    it('performs put request',  async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          204,
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function() {
        this.put('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request(store, '/test_endpoint');
      const response = await request.put();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticateAsUser', () => {
      it('performs put request with authorization header',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.put('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUser().put();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withParams', () => {
      it('performs put request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({ 'testParam': 'hi there' });
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.put('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withParams({ 'testParam': 'hi there' }).put();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withBody', () => {
      it('performs put request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({ 'testParam': 'hi there' });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.put('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withBody({ 'testParam': 'hi there' }).put();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });
  });

  describe('patch', () => {
    it('performs patch request',  async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          204,
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function() {
        this.patch('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request(store, '/test_endpoint');
      const response = await request.patch();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticateAsUser', () => {
      it('performs patch request with authorization header',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.patch('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUser().patch();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withParams', () => {
      it('performs patch request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({ 'testParam': 'hi there' });
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.patch('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withParams({ 'testParam': 'hi there' }).patch();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withBody', () => {
      it('performs patch request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({ 'testParam': 'hi there' });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.patch('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withBody({ 'testParam': 'hi there' }).patch();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });
  });

  describe('delete', () => {
    it('performs delete request',  async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          204,
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function() {
        this.delete('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request(store, '/test_endpoint');
      const response = await request.delete();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticateAsUser', () => {
      it('performs delete request with authorization header',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.delete('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        store.userAuth.accessToken = 'example_token';
        const request = new Request(store, '/test_endpoint');
        const response = await request.authenticateAsUser().delete();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withParams', () => {
      it('performs delete request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({ 'testParam': 'hi there' });
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.delete('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withParams({ 'testParam': 'hi there' }).delete();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withBody', () => {
      it('performs delete request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({ 'testParam': 'hi there' });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            204,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.delete('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request(store, '/test_endpoint');
        const response = await request.withBody({ 'testParam': 'hi there' }).delete();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });
  });
});
