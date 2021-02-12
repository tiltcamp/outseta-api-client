import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import { Subscriptions } from '../../../../src/api/billing/subscriptions';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { Subscription } from '../../../../src/models/billing/subscription';

describe('api', () => {
  describe('Billing', () => {
    describe('Subscriptions', () => {
      describe('setSubscriptionUpgradeRequired', () => {
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
            expect(JSON.parse(request.requestBody)).toEqual({
              IsPlanUpgradeRequired: true,
              PlanUpgradeRequiredMessage: 'Usage too high',
              Uid: 'LmJMEYWP'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/LmJMEYWP/setsubscriptionupgraderequired', responseHandler);
          });

          const response = await subscriptions.setSubscriptionUpgradeRequired({
            IsPlanUpgradeRequired: true,
            PlanUpgradeRequiredMessage: 'Usage too high',
            Uid: 'LmJMEYWP'
          }) as Subscription;

          expect(response.IsPlanUpgradeRequired).toBe(true);
          expect(response.PlanUpgradeRequiredMessage).toBe('Usage too high');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              IsPlanUpgradeRequired: true,
              PlanUpgradeRequiredMessage: 'Usage too high',
              Uid: 'LmJMEYWP'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/LmJMEYWP/setsubscriptionupgraderequired', responseHandler);
          });

          const response = await subscriptions.setSubscriptionUpgradeRequired({
            IsPlanUpgradeRequired: true,
            PlanUpgradeRequiredMessage: 'Usage too high',
            Uid: 'LmJMEYWP'
          }) as ValidationError<null>;

          expect(response.ErrorMessage).toBe('The Subscription was not found.');
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              IsPlanUpgradeRequired: true,
              PlanUpgradeRequiredMessage: 'malformed',
              Uid: 'LmJMEYWP'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/LmJMEYWP/setsubscriptionupgraderequired', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await subscriptions.setSubscriptionUpgradeRequired({
              IsPlanUpgradeRequired: true,
              PlanUpgradeRequiredMessage: 'malformed',
              Uid: 'LmJMEYWP'
            });
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
  "BillingRenewalTerm": 1,
  "Account": {
    "Name": "TiltCamp Co.",
    "ClientIdentifier": null,
    "IsDemo": false,
    "BillingAddress": null,
    "MailingAddress": null,
    "AccountStage": 3,
    "PaymentInformation": null,
    "PersonAccount": null,
    "Subscriptions": null,
    "Deals": null,
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
    "Uid": "rm081GmX",
    "Created": "2021-02-07T18:28:36",
    "Updated": "2021-02-07T18:30:42"
  },
  "Plan": {
    "Name": "Basic",
    "Description": "<p>All the important stuff.</p>",
    "PlanFamily": null,
    "IsQuantityEditable": false,
    "MinimumQuantity": 0,
    "MonthlyRate": 49.99,
    "AnnualRate": 0.00,
    "SetupFee": 0.00,
    "IsTaxable": false,
    "IsActive": true,
    "TrialPeriodDays": 7,
    "UnitOfMeasure": "",
    "PlanAddOns": null,
    "ContentGroups": null,
    "NumberOfSubscriptions": 0,
    "Uid": "wZmNw7Q2",
    "Created": "2020-11-13T03:44:06",
    "Updated": "2021-01-19T04:09:42"
  },
  "Quantity": null,
  "StartDate": "2021-02-07T18:29:47",
  "EndDate": null,
  "RenewalDate": "2021-02-14T18:29:47",
  "NewRequiredQuantity": null,
  "IsPlanUpgradeRequired": true,
  "PlanUpgradeRequiredMessage": "Usage too high",
  "SubscriptionAddOns": [
    {
      "BillingRenewalTerm": 1,
      "Subscription": null,
      "AddOn": null,
      "Quantity": null,
      "StartDate": "2021-02-07T18:29:47",
      "EndDate": null,
      "RenewalDate": "2021-03-07T18:29:47",
      "NewRequiredQuantity": null,
      "Uid": "amRynEWJ",
      "Created": "2021-02-07T18:29:47",
      "Updated": "2021-02-07T18:29:47"
    }
  ],
  "DiscountCouponSubscriptions": [],
  "Uid": "LmJMEYWP",
  "Created": "2021-02-07T18:29:47",
  "Updated": "2021-02-07T18:44:48.9741527Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "The Subscription was not found.",
  "EntityValidationErrors": []
};
