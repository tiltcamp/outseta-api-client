import Pretender, { ResponseHandler } from 'pretender';
import { Usage } from '../../../../src/api/billing/usage';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Billing', () => {
    describe('Usage', () => {
      describe('getAll', () => {
        let server: Pretender;
        let store: Store;

        let usage: Usage;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          usage = new Usage(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Usage.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          const response = await usage.getAll();
          expect(response.metadata.total).toBe(3);
          expect(response.items).toHaveSize(3);
          expect(response.items[0].Uid).toBe("E9LZ35mw");
          expect(response.items[0].Amount).toBe(10.0);
        });

        it('handles request with pagination, filters, fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              offset: '10',
              limit: '20',
              'SubscriptionAddOn.Subscription.Account.Uid': 'jW7GJVWq',
              fields: '*'
            });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleNoResults)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          const response = await usage.getAll({
            offset: 10,
            limit: 20,
            Account: {
              Uid: 'jW7GJVWq'
            },
            fields: '*'
          });
          expect(response.metadata.total).toBe(0);
          expect(response.items).toHaveSize(0);
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Usage.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await usage.getAll();
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
  "metadata": {
    "limit": 100,
    "offset": 0,
    "total": 3
  },
  "items": [
    {
      "UsageDate": "2017-12-01T10:00:00",
      "Invoice": null,
      "SubscriptionAddOn": {
        "BillingRenewalTerm": 1,
        "Subscription": {
          "Account": {
            "Uid": "2amRxA9J"
          },
          "Uid": "4XQYdemP"
        },
        "AddOn": {
          "Uid": "y7marQEq"
        },
        "Quantity": null,
        "StartDate": "2018-04-10T11:44:16",
        "EndDate": null,
        "RenewalDate": "2021-03-10T11:44:16",
        "NewRequiredQuantity": null,
        "Uid": "KjW7e4Qq",
        "Created": "2018-04-10T11:44:16",
        "Updated": "2021-02-11T00:00:31"
      },
      "Amount": 10.00,
      "Uid": "E9LZ35mw",
      "Created": "2021-02-12T06:55:21",
      "Updated": "2021-02-12T06:55:21"
    },
    {
      "UsageDate": "2017-12-01T18:00:00",
      "Invoice": null,
      "SubscriptionAddOn": {
        "BillingRenewalTerm": 1,
        "Subscription": {
          "Account": {
            "Uid": "amRdzZ9J"
          },
          "Uid": "OW48KRWg"
        },
        "AddOn": {
          "Uid": "3wQX0kQK"
        },
        "Quantity": null,
        "StartDate": "2021-02-13T05:08:29",
        "EndDate": null,
        "RenewalDate": "2021-03-13T05:08:29",
        "NewRequiredQuantity": null,
        "Uid": "z9MKvMm4",
        "Created": "2021-02-13T05:08:29",
        "Updated": "2021-02-13T05:08:29"
      },
      "Amount": 28.00,
      "Uid": "E9LZ85mw",
      "Created": "2021-02-13T20:54:01",
      "Updated": "2021-02-13T20:54:01"
    },
    {
      "UsageDate": "2021-02-13T18:32:11",
      "Invoice": null,
      "SubscriptionAddOn": {
        "BillingRenewalTerm": 1,
        "Subscription": {
          "Account": {
            "Uid": "jW7GJVWq"
          },
          "Uid": "7maeq5mE"
        },
        "AddOn": {
          "Uid": "3wQX0kQK"
        },
        "Quantity": null,
        "StartDate": "2021-02-13T17:48:57",
        "EndDate": null,
        "RenewalDate": "2021-03-13T17:48:57",
        "NewRequiredQuantity": null,
        "Uid": "LmJv3PmP",
        "Created": "2021-02-13T17:48:57",
        "Updated": "2021-02-13T17:48:57"
      },
      "Amount": 5.00,
      "Uid": "pWrEgM9n",
      "Created": "2021-02-13T18:32:16",
      "Updated": "2021-02-13T18:32:16"
    }
  ]
};

const exampleNoResults = {
  "metadata": {
    "limit": 100,
    "offset": 0,
    "total": 0
  },
  "items": []
};
