import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import Accounts from '../../../../src/api/crm/accounts';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { AccountStage } from '../../../../src/models/crm/account-stage';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('delete', () => {
        let server: Pretender;
        let store: Store;

        let accounts: Accounts;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          accounts = new Accounts(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              ''
            ];
          };
          server = new Pretender(function () {
            this.delete('https://test-company.outseta.com/api/v1/crm/accounts/BWz87NQE', responseHandler);
          });

          const response = await accounts.delete('BWz87NQE');
          expect(response).toBeNull();
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              404,
              {'Content-Type': 'application/json'},
              ''
            ];
          };
          server = new Pretender(function () {
            this.delete('https://test-company.outseta.com/api/v1/crm/accounts/BWz87NQE', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.delete('BWz87NQE');
          } catch (e) {
            exception = e;
          }

          expect(response).toBeUndefined();
          expect(exception.status).toBe(404);
        });
      });
    });
  });
});
