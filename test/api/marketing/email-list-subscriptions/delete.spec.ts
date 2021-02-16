import Pretender, { ResponseHandler } from 'pretender';
import { EmailListSubscriptions } from '../../../../src/api/marketing/email-list-subscriptions';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Marketing', () => {
    describe('EmailListSubscriptions', () => {
      describe('delete', () => {
        let server: Pretender;
        let store: Store;

        let emailListSubscriptions: EmailListSubscriptions;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          emailListSubscriptions = new EmailListSubscriptions(store);
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
            this.delete('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions/wQXrBxWK', responseHandler);
          });

          const response = await emailListSubscriptions.delete({
            EmailList: {
              Uid: 'ngWKYnQp'
            },
            Person: {
              Uid: 'wQXrBxWK'
            }
          });
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
            this.delete('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions/wQXrBxWK', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await emailListSubscriptions.delete({
              EmailList: {
                Uid: 'ngWKYnQp'
              },
              Person: {
                Uid: 'wQXrBxWK'
              }
            });
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
