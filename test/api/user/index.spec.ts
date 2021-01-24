import User from '../../../src/api/user';
import Profile from '../../../src/api/user/profile';
import Store from '../../../src/util/store';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';

describe('api', () =>
  describe('User', () =>
    describe('constructor', () => {
      it('creates successfully', () => {
        const user = new User(
          new Store(
            'https://test-company.outseta.com/api/',
            new UserCredentials(),
            new ServerCredentials()
          )
        );

        expect(user).toBeInstanceOf(User);
        expect(user.profile).toBeInstanceOf(Profile);
      });
    })
  )
);