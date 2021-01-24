import Crm from '../../../src/api/crm';
import People from '../../../src/api/crm/people';
import Store from '../../../src/util/store';
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
        expect(crm.people).toBeInstanceOf(People);
      });
    })
  )
);
