import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { Deals } from '../../../../src/api/crm/deals';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Crm', () => {
    describe('Deals', () => {
      describe('delete', () => {
        let server: Pretender;
        let store: Store;

        let deals: Deals;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          deals = new Deals(store);
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
            this.delete('https://test-company.outseta.com/api/v1/crm/deals/wmjvOlmV', responseHandler);
          });

          const response = await deals.delete('wmjvOlmV');
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
            this.delete('https://test-company.outseta.com/api/v1/crm/deals/wmjvOlmV', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await deals.delete('wmjvOlmV');
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
