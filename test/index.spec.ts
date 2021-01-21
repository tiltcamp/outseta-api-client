import Outseta from '../src';
import User from '../src/api/user';
import Billing from '../src/api/billing';

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
