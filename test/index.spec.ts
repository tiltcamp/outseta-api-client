import Outseta from '../src';
import { Crm } from '../src/api/crm';
import { Marketing } from '../src/api/marketing';
import { User } from '../src/api/user';
import { Billing } from '../src/api/billing';

describe('constructor', () => {
  it('creates successfully', () => {
    const outseta = new Outseta({
      subdomain: 'example'
    });

    expect(outseta).toBeInstanceOf(Outseta);
    expect(outseta.billing).toBeInstanceOf(Billing);
    expect(outseta.crm).toBeInstanceOf(Crm);
    expect(outseta.marketing).toBeInstanceOf(Marketing);
    expect(outseta.user).toBeInstanceOf(User);
  });
});
