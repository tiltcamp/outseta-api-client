import { Crm } from '../../../src/api/crm';
import { Activities } from '../../../src/api/crm/activities';
import { Deals } from '../../../src/api/crm/deals';
import { People } from '../../../src/api/crm/people';
import { Accounts } from '../../../src/api/crm/accounts';
import { Store } from '../../../src/util/store';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';

describe('api', () =>
  describe('Crm', () =>
    describe('constructor', () => {
      it('creates successfully', () => {
        const crm = new Crm(
          new Store(
            'https://test-company.outseta.com/api/',
            new UserCredentials(),
            new ServerCredentials()
          )
        );

        expect(crm).toBeInstanceOf(Crm);
        expect(crm.accounts).toBeInstanceOf(Accounts);
        expect(crm.activities).toBeInstanceOf(Activities);
        expect(crm.deals).toBeInstanceOf(Deals);
        expect(crm.people).toBeInstanceOf(People);
      });
    })
  )
);
