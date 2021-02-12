import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import { Accounts } from '../../../../src/api/crm/accounts';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { Account } from '../../../../src/models/crm/account';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('removeCancellation', () => {
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
              exampleResponse
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/jW7GJVWq/remove-cancellation', responseHandler);
          });

          const response = await accounts.removeCancellation('jW7GJVWq');
          expect(response).toBeNull();
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/jW7GJVWq/remove-cancellation', responseHandler);
          });

          const response = await accounts.removeCancellation('jW7GJVWq') as ValidationError<Account>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "An account needs to be in a cancelling state.",
            PropertyName: "AccountStage"
          });
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
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/jW7GJVWq/remove-cancellation', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.removeCancellation('jW7GJVWq');
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

const exampleResponse = '';

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Name": "Best Co.",
        "ClientIdentifier": null,
        "IsDemo": false,
        "BillingAddress": {
          "AddressLine1": null,
          "AddressLine2": null,
          "AddressLine3": null,
          "City": "",
          "State": "",
          "PostalCode": "",
          "Country": null,
          "Uid": "1QpN4xWE",
          "Created": "2021-02-10T17:04:00",
          "Updated": "2021-02-10T17:04:00"
        },
        "MailingAddress": {
          "AddressLine1": null,
          "AddressLine2": null,
          "AddressLine3": null,
          "City": "",
          "State": "",
          "PostalCode": "",
          "Country": null,
          "Uid": "amRg1EQJ",
          "Created": "2021-02-10T17:04:00",
          "Updated": "2021-02-10T17:04:00"
        },
        "AccountStage": 3,
        "PaymentInformation": null,
        "PersonAccount": [
          {
            "Person": null,
            "Account": null,
            "IsPrimary": true,
            "Uid": "L9nRwG9Z",
            "Created": "2021-02-10T17:04:00",
            "Updated": "2021-02-10T17:04:00"
          }
        ],
        "Subscriptions": [
          {
            "BillingRenewalTerm": 1,
            "Account": null,
            "Plan": null,
            "Quantity": null,
            "StartDate": "2021-02-11T03:32:48",
            "EndDate": "2021-02-11T03:39:17",
            "RenewalDate": null,
            "NewRequiredQuantity": null,
            "IsPlanUpgradeRequired": false,
            "PlanUpgradeRequiredMessage": null,
            "SubscriptionAddOns": null,
            "DiscountCouponSubscriptions": null,
            "Uid": "L9nKgeWZ",
            "Created": "2021-02-11T03:32:48",
            "Updated": "2021-02-11T03:39:17"
          },
          {
            "BillingRenewalTerm": 1,
            "Account": null,
            "Plan": null,
            "Quantity": null,
            "StartDate": "2021-02-11T03:39:17",
            "EndDate": null,
            "RenewalDate": "2021-03-11T03:39:17",
            "NewRequiredQuantity": null,
            "IsPlanUpgradeRequired": false,
            "PlanUpgradeRequiredMessage": null,
            "SubscriptionAddOns": null,
            "DiscountCouponSubscriptions": null,
            "Uid": "pWrK6Lmn",
            "Created": "2021-02-11T03:39:17",
            "Updated": "2021-02-11T03:39:17"
          }
        ],
        "Deals": [],
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
        "LatestSubscription": {
          "BillingRenewalTerm": 1,
          "Account": null,
          "Plan": null,
          "Quantity": null,
          "StartDate": "2021-02-11T03:39:17",
          "EndDate": null,
          "RenewalDate": "2021-03-11T03:39:17",
          "NewRequiredQuantity": null,
          "IsPlanUpgradeRequired": false,
          "PlanUpgradeRequiredMessage": null,
          "SubscriptionAddOns": null,
          "DiscountCouponSubscriptions": null,
          "Uid": "pWrK6Lmn",
          "Created": "2021-02-11T03:39:17",
          "Updated": "2021-02-11T03:39:17"
        },
        "CurrentSubscription": {
          "BillingRenewalTerm": 1,
          "Account": null,
          "Plan": null,
          "Quantity": null,
          "StartDate": "2021-02-11T03:39:17",
          "EndDate": null,
          "RenewalDate": "2021-03-11T03:39:17",
          "NewRequiredQuantity": null,
          "IsPlanUpgradeRequired": false,
          "PlanUpgradeRequiredMessage": null,
          "SubscriptionAddOns": null,
          "DiscountCouponSubscriptions": null,
          "Uid": "pWrK6Lmn",
          "Created": "2021-02-11T03:39:17",
          "Updated": "2021-02-11T03:39:17"
        },
        "PrimaryContact": null,
        "PrimarySubscription": null,
        "RecaptchaToken": null,
        "LifetimeRevenue": 0.0,
        "Uid": "jW7GJVWq",
        "Created": "2021-02-10T17:04:00",
        "Updated": "2021-02-11T03:39:17"
      },
      "TypeName": "Account",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "An account needs to be in a cancelling state.",
          "PropertyName": "AccountStage"
        }
      ]
    }
  ]
};
