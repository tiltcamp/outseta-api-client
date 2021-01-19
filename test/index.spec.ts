import Outseta from '@src/index';

describe('Outseta', () => {
  describe('constructor', () => {
    it('creates successfully', () => {
      const outseta = new Outseta({
        subdomain: 'example'
      });

      expect(outseta).toBeInstanceOf(Outseta);
    });
  });
});
