import Credentials from '@src/util/credentials';

describe('Credentials', () => {
  describe('constructor', () => {
    it('succeeds with client-side access token', () => {
      const credentials = new Credentials({
        accessToken: 'example_token'
      });

      expect(credentials).toBeInstanceOf(Credentials);
      expect(credentials.accessToken).toBe('example_token');
      expect(credentials.apiKey).toBeUndefined();
      expect(credentials.secretKey).toBeUndefined();
    });

    it('succeeds with server-side API key and secret key', () => {
      const credentials = new Credentials({
        apiKey: 'example_api_key',
        secretKey: 'example_secret_key'
      });

      expect(credentials).toBeInstanceOf(Credentials);
      expect(credentials.accessToken).toBeUndefined();
      expect(credentials.apiKey).toBe('example_api_key');
      expect(credentials.secretKey).toBe('example_secret_key');
    });

    it('prefers access token over API key and secret key', () => {
      const credentials = new Credentials({
        accessToken: 'example_token',
        apiKey: 'example_api_key',
        secretKey: 'example_secret_key'
      });

      expect(credentials).toBeInstanceOf(Credentials);
      expect(credentials.accessToken).toBe('example_token');
      expect(credentials.apiKey).toBeUndefined();
      expect(credentials.secretKey).toBeUndefined();
    });

    it('fails without access token or api keys', () => {
      let exception;
      let credentials;

      try {
        credentials = new Credentials({});
      } catch (e) {
        exception = e;
      }

      expect(credentials).toBeUndefined();
      expect(exception).toBe(
        'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).'
      );
    });

    it('fails with API key and missing secret key', () => {
      let exception;
      let credentials;

      try {
        credentials = new Credentials({
          apiKey: 'example_api_key'
        });
      } catch (e) {
        exception = e;
      }

      expect(credentials).toBeUndefined();
      expect(exception).toBe(
        'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).'
      );
    });

    it('fails with secret key and missing API key', () => {
      let exception;
      let credentials;

      try {
        credentials = new Credentials({
          secretKey: 'example_secret_key'
        });
      } catch (e) {
        exception = e;
      }

      expect(credentials).toBeUndefined();
      expect(exception).toBe(
        'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).'
      );
    });
  });

  describe('credentialsorizationHeader', () => {
    it('returns header for client-side access token', () => {
      const credentials = new Credentials({
        accessToken: 'example_token'
      });

      expect(credentials.authorizationHeader).toBe('bearer example_token');
    });

    it('returns header for server-side API key and secret key', () => {
      const credentials = new Credentials({
        apiKey: 'example_api_key',
        secretKey: 'example_secret_key'
      });

      expect(credentials.authorizationHeader).toBe('Outseta example_api_key:example_secret_key');
    });
  });
});
