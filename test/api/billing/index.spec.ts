import Billing from '../../../src/api/billing';
import Plans from '../../../src/api/billing/plans';
import Store from '../../../src/util/store';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';

describe('api', () =>
  describe('Billing', () =>
    describe('constructor', () => {
      it('creates successfully', () => {
        const billing = new Billing(
          new Store(
            'https://test-company.outseta.com/api/',
            new UserCredentials(),
            new ServerCredentials()
          )
        );

        expect(billing).toBeInstanceOf(Billing);
        expect(billing.plans).toBeInstanceOf(Plans);
      });
    })
  )
);