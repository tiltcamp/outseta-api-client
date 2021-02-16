import { Marketing } from '../../../src/api/marketing';
import { EmailListSubscriptions } from '../../../src/api/marketing/email-list-subscriptions';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';
import { Store } from '../../../src/util/store';

describe('api', () =>
  describe('Marketing', () =>
    describe('constructor', () => {
      it('creates successfully', () => {
        const marketing = new Marketing(
          new Store(
            'https://test-company.outseta.com/api/',
            new UserCredentials(),
            new ServerCredentials()
          )
        );

        expect(marketing).toBeInstanceOf(Marketing);
        expect(marketing.emailListSubscriptions).toBeInstanceOf(EmailListSubscriptions);
      });
    })
  )
);
