import Outseta from '@src/index';
import User from '@src/api/user';
import Billing from '@src/api/billing';

describe('constructor', () => {
  it('creates successfully', () => {
    const outseta = new Outseta({
      subdomain: 'example'
    });

    expect(outseta).toBeInstanceOf(Outseta);
    expect(outseta.user).toBeInstanceOf(User);
    expect(outseta.billing).toBeInstanceOf(Billing);
  });
});
