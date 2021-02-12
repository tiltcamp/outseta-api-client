import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import { Subscriptions } from '../../../../src/api/billing/subscriptions';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { Account } from '../../../../src/models/crm/account';

describe('api', () => {
  describe('Billing', () => {
    describe('Subscriptions', () => {
      describe('changeTrialToSubscribed', () => {
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
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/LmJMEYWP/changetrialtosubscribed', responseHandler);
          });

          const response = await subscriptions.changeTrialToSubscribed('LmJMEYWP');
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
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/LmJMEYWP/changetrialtosubscribed', responseHandler);
          });

          const response = await subscriptions.changeTrialToSubscribed('LmJMEYWP') as ValidationError<Account>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "The account need to be in trial to change the stage to subscriber.",
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
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/LmJMEYWP/changetrialtosubscribed', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await subscriptions.changeTrialToSubscribed('LmJMEYWP');
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
        "Name": "TiltCamp Co.",
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
          "Uid": "zWZxNAQp",
          "Created": "2021-02-07T18:28:36",
          "Updated": "2021-02-07T18:28:36"
        },
        "MailingAddress": {
          "AddressLine1": null,
          "AddressLine2": null,
          "AddressLine3": null,
          "City": "",
          "State": "",
          "PostalCode": "",
          "Country": null,
          "Uid": "LmJe0lWP",
          "Created": "2021-02-07T18:28:36",
          "Updated": "2021-02-07T18:28:36"
        },
        "AccountStage": 3,
        "PaymentInformation": null,
        "PersonAccount": [
          {
            "Person": null,
            "Account": null,
            "IsPrimary": true,
            "Uid": "NmdlYgm0",
            "Created": "2021-02-07T18:28:36",
            "Updated": "2021-02-07T18:28:36"
          }
        ],
        "Subscriptions": [
          {
            "BillingRenewalTerm": 1,
            "Account": null,
            "Plan": null,
            "Quantity": null,
            "StartDate": "2021-02-07T18:29:47",
            "EndDate": null,
            "RenewalDate": "2021-02-14T18:29:47",
            "NewRequiredQuantity": null,
            "IsPlanUpgradeRequired": false,
            "PlanUpgradeRequiredMessage": null,
            "SubscriptionAddOns": null,
            "DiscountCouponSubscriptions": null,
            "Uid": "LmJMEYWP",
            "Created": "2021-02-07T18:29:47",
            "Updated": "2021-02-07T18:29:47"
          }
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
        "LatestSubscription": {
          "BillingRenewalTerm": 1,
          "Account": null,
          "Plan": null,
          "Quantity": null,
          "StartDate": "2021-02-07T18:29:47",
          "EndDate": null,
          "RenewalDate": "2021-02-14T18:29:47",
          "NewRequiredQuantity": null,
          "IsPlanUpgradeRequired": false,
          "PlanUpgradeRequiredMessage": null,
          "SubscriptionAddOns": null,
          "DiscountCouponSubscriptions": null,
          "Uid": "LmJMEYWP",
          "Created": "2021-02-07T18:29:47",
          "Updated": "2021-02-07T18:29:47"
        },
        "CurrentSubscription": {
          "BillingRenewalTerm": 1,
          "Account": null,
          "Plan": null,
          "Quantity": null,
          "StartDate": "2021-02-07T18:29:47",
          "EndDate": null,
          "RenewalDate": "2021-02-14T18:29:47",
          "NewRequiredQuantity": null,
          "IsPlanUpgradeRequired": false,
          "PlanUpgradeRequiredMessage": null,
          "SubscriptionAddOns": null,
          "DiscountCouponSubscriptions": null,
          "Uid": "LmJMEYWP",
          "Created": "2021-02-07T18:29:47",
          "Updated": "2021-02-07T18:29:47"
        },
        "PrimaryContact": null,
        "PrimarySubscription": null,
        "RecaptchaToken": null,
        "LifetimeRevenue": 0.0,
        "Uid": "rm081GmX",
        "Created": "2021-02-07T18:28:36",
        "Updated": "2021-02-07T18:30:42"
      },
      "TypeName": "Account",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "The account need to be in trial to change the stage to subscriber.",
          "PropertyName": "AccountStage"
        }
      ]
    }
  ]
};

