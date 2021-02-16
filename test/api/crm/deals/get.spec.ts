import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { Deals } from '../../../../src/api/crm/deals';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Crm', () => {
    describe('Deals', () => {
      describe('get', () => {
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
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/deals/pWrYPn9n', responseHandler);
          });

          const response = await deals.get('pWrYPn9n');
          expect(response.Name).toBe('Test Deal 1');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: 'Uid' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/deals/pWrYPn9n', responseHandler);
          });

          const response = await deals.get('pWrYPn9n', { fields: 'Uid' });
          expect(response.Name).toBe('Test Deal 1');
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/deals/pWrYPn9n', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await deals.get('pWrYPn9n');
          } catch (e) {
            exception = e;
          }

          expect(response).toBeUndefined();
          expect(exception.status).toBe(500);
        });
      });
    });
  });
});

const exampleResponse = {
  "Name": "Test Deal 1",
  "Amount": 100000.00,
  "DueDate": "2021-02-15T08:00:00",
  "AssignedToPersonClientIdentifier": "Rm8rb7y9",
  "Weight": 0,
  "DealPipelineStage": null,
  "Account": null,
  "DealPeople": null,
  "Contacts": "hello@tiltcamp.com",
  "Owner": null,
  "Uid": "Rm8pvym4",
  "Created": "2021-02-15T20:59:07",
  "Updated": "2021-02-15T20:59:07"
};
