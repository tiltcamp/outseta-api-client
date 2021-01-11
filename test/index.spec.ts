import Outseta from '@src/index';
import Request from '@src/util/request';
import Credentials from '@src/util/credentials';

describe('Outseta', () => {
  describe('constructor', () => {
    it('creates successfully', () => {
      const outseta = new Outseta({
        subdomain: 'test-company',
        accessToken: 'example_token'
      });

      expect(outseta).toBeInstanceOf(Outseta);
    });

    it('sets static attributes on Request', () => {
      new Outseta({
        subdomain: 'test-company',
        accessToken: 'example_token'
      });

      expect(Request.credentials).toBeInstanceOf(Credentials);
      expect(Request.credentials.authorizationHeader).toBe('bearer example_token');

      expect(Request.baseUrl).toBe('https://test-company.outseta.com/api/v1/');
    })
  });
});
