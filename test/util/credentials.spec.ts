import { UserCredentials, ServerCredentials } from '@src/util/credentials';

describe('ServerCredentials', () => {
  describe('authorizationHeader', () => {
    it('returns header for server-side API keys', () => {
      const credentials = new ServerCredentials('example_api_key', 'example_secret_key');
      expect(credentials.authorizationHeader).toBe('Outseta example_api_key:example_secret_key');
    });

    it('throws an exception if there aren\'t any API keys', () => {
      let exception;
      const credentials = new ServerCredentials();

      try {
        credentials.authorizationHeader
      } catch (e) {
        exception = e;
      }

      expect(exception).toBe(
        'The API client was not initialized with API keys.'
      );
    });
  });

  describe('isReady', () => {
    it('returns true if API key is available', () => {
      const credentials = new ServerCredentials('example_key', 'example_secret');
      expect(credentials.isReady).toBeTrue();
    });

    it('returns false if API key is not provided', () => {
      let credentials = new ServerCredentials();
      expect(credentials.isReady).toBeFalse();

      credentials = new ServerCredentials('example_api_key');
      expect(credentials.isReady).toBeFalse();

      credentials = new ServerCredentials('', 'example_secret_key');
      expect(credentials.isReady).toBeFalse();
    });
  });
});

describe('UserCredentials', () => {
  describe('authorizationHeader', () => {
    it('returns header for client-side access token', () => {
      const credentials = new UserCredentials('example_token');
      expect(credentials.authorizationHeader).toBe('bearer example_token');
    });

    it('throws an exception if there aren\'t any API keys', () => {
      let exception;
      const credentials = new UserCredentials();

      try {
        credentials.authorizationHeader
      } catch (e) {
        exception = e;
      }

      expect(exception).toBe(
        'The API client doesn\'t have a user token. Please initialize the client with one or ' +
        'call profile.login() first.'
      );
    });
  });

  describe('isReady', () => {
    it('returns true if access token is available', () => {
      let credentials = new UserCredentials('example_token');
      expect(credentials.isReady).toBeTrue();

      credentials = new UserCredentials();
      credentials.accessToken = 'example_token';
      expect(credentials.isReady).toBeTrue();
    });

    it('returns false if access token is not provided', () => {
      let credentials = new UserCredentials();
      expect(credentials.isReady).toBeFalse();

      credentials = new UserCredentials('');
      expect(credentials.isReady).toBeFalse();
    });
  });
});
