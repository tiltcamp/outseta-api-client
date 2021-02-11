import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import Subscriptions from '../../../../src/api/billing/subscriptions';

describe('api', () => {
  describe('Billing', () => {
    describe('Subscriptions', () => {
      describe('getAll', () => {
        let server: Pretender;
        let store: Store;

        let subscriptions: Subscriptions;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          subscriptions = new Subscriptions(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*,Account.Uid,Plan.Uid' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/subscriptions', responseHandler);
          });

          const response = await subscriptions.getAll();
          expect(response.metadata.total).toBe(1);
          expect(response.items).toHaveSize(1);
          expect(response.items[0].Account.Uid).toBe("nmDAv0Qy");
        });

        it('handles request with pagination, filters, fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              offset: '10',
              limit: '20',
              'Account.Uid': 'jW7GJVWq',
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
            this.get('https://test-company.outseta.com/api/v1/billing/subscriptions', responseHandler);
          });

          const response = await subscriptions.getAll({
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
            expect(request.queryParams).toEqual({
              fields: '*,Account.Uid,Plan.Uid'
            });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleFailureResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/subscriptions', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await subscriptions.getAll();
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
    "total": 1
  },
  "items": [
    {
      "BillingRenewalTerm": 1,
      "Account": {
        "Uid": "nmDAv0Qy"
      },
      "Plan": {
        "Uid": "wZmNw7Q2"
      },
      "Quantity": null,
      "StartDate": "2021-02-07T21:58:52",
      "EndDate": null,
      "RenewalDate": "2021-02-14T21:58:52",
      "NewRequiredQuantity": null,
      "IsPlanUpgradeRequired": false,
      "PlanUpgradeRequiredMessage": null,
      "SubscriptionAddOns": null,
      "DiscountCouponSubscriptions": null,
      "Uid": "dQGxEz94",
      "Created": "2021-02-07T21:58:52",
      "Updated": "2021-02-07T21:58:52"
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

const exampleFailureResponse = {
  "ErrorMessage": "Could not convert hash  to long",
  "EntityValidationErrors": []
};
