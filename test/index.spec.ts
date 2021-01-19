import Outseta from '@src/index';
import Billing from '@src/api/billing';

describe('Outseta', () => {
  describe('constructor', () => {
    it('creates successfully', () => {
      const outseta = new Outseta({
        subdomain: 'example'
      });

      expect(outseta).toBeInstanceOf(Outseta);
      expect(outseta.billing).toBeInstanceOf(Billing);
    });
  });
});
