import Outseta from '@src/index';

describe('Outseta', () => {
  describe('constructor', () => {
    it('creates successfully', () => {
      const outseta = new Outseta({
        subdomain: 'example',
        accessToken: 'example_token'
      });

      expect(outseta).toBeInstanceOf(Outseta);
    });
  });
});
