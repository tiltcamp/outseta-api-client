import Outseta from '@src/index';

describe('Outseta', () => {
  describe('constructor', () => {
    it('succeeds with client-side access token', () => {
      const outseta = new Outseta({
        subdomain: 'example',
        accessToken: 'example_token'
      });

      expect(outseta).toBeInstanceOf(Outseta);
      expect(outseta.accessToken).toBe('example_token');
      expect(outseta.apiKey).toBeUndefined();
      expect(outseta.secretKey).toBeUndefined();
    });

    it('succeeds with server-side API key and secret key', () => {
      const outseta = new Outseta({
        subdomain: 'example',
        apiKey: 'example_api_key',
        secretKey: 'example_secret_key'
      });

      expect(outseta).toBeInstanceOf(Outseta);
      expect(outseta.accessToken).toBeUndefined();
      expect(outseta.apiKey).toBe('example_api_key');
      expect(outseta.secretKey).toBe('example_secret_key');
    });

    it('prefers access token over API key and secret key', () => {
      const outseta = new Outseta({
        subdomain: 'example',
        accessToken: 'example_token',
        apiKey: 'example_api_key',
        secretKey: 'example_secret_key'
      });

      expect(outseta).toBeInstanceOf(Outseta);
      expect(outseta.accessToken).toBe('example_token');
      expect(outseta.apiKey).toBeUndefined();
      expect(outseta.secretKey).toBeUndefined();
    });

    it('fails without access token or api keys', () => {
      let exception;
      let outseta;

      try {
        outseta = new Outseta({
          subdomain: 'example'
        });
      } catch (e) {
        exception = e;
      }

      expect(outseta).toBeUndefined();
      expect(exception).toBe(
        'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).'
      );
    });

    it('fails with API key and missing secret key', () => {
      let exception;
      let outseta;

      try {
        outseta = new Outseta({
          subdomain: 'example',
          apiKey: 'example_api_key'
        });
      } catch (e) {
        exception = e;
      }

      expect(outseta).toBeUndefined();
      expect(exception).toBe(
        'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).'
      );
    });

    it('fails with secret key and missing API key', () => {
      let exception;
      let outseta;

      try {
        outseta = new Outseta({
          subdomain: 'example',
          secretKey: 'example_secret_key'
        });
      } catch (e) {
        exception = e;
      }

      expect(outseta).toBeUndefined();
      expect(exception).toBe(
        'Initializing outseta-api-client requires either an access token (for client-side usage) or ' +
        'an API key and secret (for server-side usage).'
      );
    });
  });

  describe('authorizationHeader', () => {
    it('returns header for client-side access token', () => {
      const outseta = new Outseta({
        subdomain: 'example',
        accessToken: 'example_token'
      });

      expect(outseta.authorizationHeader).toBe('bearer example_token');
    });

    it('returns header for server-side API key and secret key', () => {
      const outseta = new Outseta({
        subdomain: 'example',
        apiKey: 'example_api_key',
        secretKey: 'example_secret_key'
      });

      expect(outseta.authorizationHeader).toBe('Outseta example_api_key:example_secret_key');
    });
  });
});
