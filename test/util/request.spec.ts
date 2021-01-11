import Pretender, { ResponseHandler } from 'pretender';

import Request from '@src/util/request';
import Credentials from '@src/util/credentials';

Request.baseUrl = 'https://test-company.outseta.com/api/'
Request.credentials = new Credentials({ accessToken: 'example_token' })

describe('Request', () => {
  let server: Pretender | null;

  beforeEach(() => {
    if (server) server.shutdown();
  });

  describe('constructor', () => {
    it('uses unfetch by default', async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = () => {
        requestReceived = true;

        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function() {
        this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request('/test_endpoint');
      await request.get();
      expect(requestReceived).toBeFalse();
    });
  });

  describe('get', () => {
    it('performs get request',  async () => {
      let requestReceived = false;
      const responseHandler: ResponseHandler = (request) => {
        requestReceived = true;
        expect(request.requestHeaders['authorization']).toBeUndefined();
        expect(request.queryParams).toEqual({});
        expect(request.requestBody).toBeNull();
        expect(request.requestHeaders['content-type']).toBe('application/json');

        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            message: 'Hello World'
          })
        ];
      };
      server = new Pretender(function() {
        this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
      });

      const request = new Request('/test_endpoint', self.fetch);
      const response = await request.get();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticated', () => {
      it('performs get request with authorization header',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBe('bearer example_token');
          expect(request.queryParams).toEqual({});
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.authenticated().get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });

    describe('withParams', () => {
      it('performs get request with query parameters',  async () => {
        let requestReceived = false;
        const responseHandler: ResponseHandler = (request) => {
          requestReceived = true;
          expect(request.requestHeaders['authorization']).toBeUndefined();
          expect(request.queryParams).toEqual({ 'testParam': 'hi there' });
          expect(request.requestBody).toBeNull();
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              message: 'Hello World'
            })
          ];
        }
        server = new Pretender(function() {
          this.get('https://test-company.outseta.com/api/test_endpoint', responseHandler);
        });

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.withParams({ 'testParam': 'hi there' }).get();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
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

      const request = new Request('/test_endpoint', self.fetch);
      const response = await request.post();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticated', () => {
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

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.authenticated().post();

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

        const request = new Request('/test_endpoint', self.fetch);
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

        const request = new Request('/test_endpoint', self.fetch)
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

        const request = new Request('/test_endpoint', self.fetch);
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

        const request = new Request('/test_endpoint', self.fetch)
          .withBody({ 'callOne': 'hi', 'replaceMe': 'hello' });
        const response = await request.withBody({ 'callTwo': 'hey', 'replaceMe': 'hey' }).post();

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

      const request = new Request('/test_endpoint', self.fetch);
      const response = await request.put();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticated', () => {
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

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.authenticated().put();

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

        const request = new Request('/test_endpoint', self.fetch);
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

        const request = new Request('/test_endpoint', self.fetch);
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

      const request = new Request('/test_endpoint', self.fetch);
      const response = await request.patch();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticated', () => {
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

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.authenticated().patch();

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

        const request = new Request('/test_endpoint', self.fetch);
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

        const request = new Request('/test_endpoint', self.fetch);
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

      const request = new Request('/test_endpoint', self.fetch);
      const response = await request.delete();

      expect(response.ok).toBeTrue();
      expect(requestReceived).toBeTrue();
      expect(await response.json()).toEqual({ message: 'Hello World' });
    });

    describe('authenticated', () => {
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

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.authenticated().delete();

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

        const request = new Request('/test_endpoint', self.fetch);
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

        const request = new Request('/test_endpoint', self.fetch);
        const response = await request.withBody({ 'testParam': 'hi there' }).delete();

        expect(response.ok).toBeTrue();
        expect(requestReceived).toBeTrue();
        expect(await response.json()).toEqual({ message: 'Hello World' });
      });
    });
  });
});
