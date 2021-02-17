import { Support } from '../../../src/api/support';
import { Cases } from '../../../src/api/support/cases';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';
import { Store } from '../../../src/util/store';

describe('api', () =>
  describe('Support', () =>
    describe('constructor', () => {
      it('creates successfully', () => {
        const support = new Support(
          new Store(
            'https://test-company.outseta.com/api/',
            new UserCredentials(),
            new ServerCredentials()
          )
        );

        expect(support).toBeInstanceOf(Support);
        expect(support.cases).toBeInstanceOf(Cases);
      });
    })
  )
);
