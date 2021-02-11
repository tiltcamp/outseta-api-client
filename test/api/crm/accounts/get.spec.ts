import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import Accounts from '../../../../src/api/crm/accounts';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('get', () => {
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
            expect(request.queryParams).toEqual({ fields: '*,PersonAccount.*,PersonAccount.Person.Uid' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/accounts/pWrYPn9n', responseHandler);
          });

          const response = await accounts.get('pWrYPn9n');
          expect(response.Name).toBe('Demo Account');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/accounts/pWrYPn9n', responseHandler);
          });

          const response = await accounts.get('pWrYPn9n', {
            fields: '*'
          });
          expect(response.Name).toBe('Demo Account');
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*,PersonAccount.*,PersonAccount.Person.Uid' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/accounts/pWrYPn9n', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.get('pWrYPn9n');
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
  "Name": "Demo Account",
  "ClientIdentifier": null,
  "IsDemo": true,
  "BillingAddress": {
    "AddressLine1": null,
    "AddressLine2": null,
    "AddressLine3": null,
    "City": "",
    "State": "",
    "PostalCode": "",
    "Country": null,
    "Uid": "VmAeg7ma",
    "Created": "2021-01-20T05:25:56",
    "Updated": "2021-01-20T05:25:56"
  },
  "MailingAddress": {
    "AddressLine1": null,
    "AddressLine2": null,
    "AddressLine3": null,
    "City": "",
    "State": "",
    "PostalCode": "",
    "Country": null,
    "Uid": "gWKwqMWp",
    "Created": "2021-01-20T05:25:56",
    "Updated": "2021-01-20T05:25:56"
  },
  "AccountStage": 3,
  "PaymentInformation": null,
  "PersonAccount": [
    {
      "Person": {
        "Uid": "L9P6gepm"
      },
      "Account": null,
      "IsPrimary": true,
      "Uid": "MQvL3kWY",
      "Created": "2021-02-04T16:22:10.8860898Z",
      "Updated": "2021-02-04T16:22:10.8860898Z"
    }
  ],
  "Subscriptions": [

  ],
  "Deals": [

  ],
  "LastLoginDateTime": null,
  "AccountSpecificPageUrl1": "",
  "AccountSpecificPageUrl2": "",
  "AccountSpecificPageUrl3": "",
  "AccountSpecificPageUrl4": "",
  "AccountSpecificPageUrl5": "",
  "RewardFulReferralId": null,
  "HasLoggedIn": false,
  "AccountStageLabel": "Subscribing",
  "DomainName": null,
  "LatestSubscription": null,
  "CurrentSubscription": null,
  "PrimaryContact": null,
  "PrimarySubscription": null,
  "RecaptchaToken": null,
  "LifetimeRevenue": 0.0,
  "Uid": "E9Ly3PWw",
  "Created": "2021-01-20T05:25:56",
  "Updated": "2021-01-20T05:25:56"
};
