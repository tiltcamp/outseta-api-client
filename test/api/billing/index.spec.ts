import { Billing } from '../../../src/api/billing';
import { Plans } from '../../../src/api/billing/plans';
import { Transactions } from '../../../src/api/billing/transactions';
import { Usage } from '../../../src/api/billing/usage';
import { Store } from '../../../src/util/store';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';
import { Invoices } from '../../../src/api/billing/invoices';
import { PlanFamilies } from '../../../src/api/billing/plan-families';

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
        expect(billing.invoices).toBeInstanceOf(Invoices);
        expect(billing.plans).toBeInstanceOf(Plans);
        expect(billing.planFamilies).toBeInstanceOf(PlanFamilies);
        expect(billing.transactions).toBeInstanceOf(Transactions);
        expect(billing.usage).toBeInstanceOf(Usage);
      });
    })
  )
);
