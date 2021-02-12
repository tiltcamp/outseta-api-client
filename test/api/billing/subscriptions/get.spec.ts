import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import { Subscriptions } from '../../../../src/api/billing/subscriptions';

describe('api', () => {
  describe('Billing', () => {
    describe('Subscriptions', () => {
      describe('get', () => {
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
            this.get('https://test-company.outseta.com/api/v1/billing/subscriptions/rmkG72mg', responseHandler);
          });

          const response = await subscriptions.get('rmkG72mg');
          expect(response.Account.Name).toBe('TiltCamp');
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
            this.get('https://test-company.outseta.com/api/v1/billing/subscriptions/rmkG72mg', responseHandler);
          });

          const response = await subscriptions.get('rmkG72mg', { fields: '*' });
          expect(response.BillingRenewalTerm).toBe(1);
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*,Account.Uid,Plan.Uid' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleFailure)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/subscriptions/rmkG72mg', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await subscriptions.get('rmkG72mg');
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
    "Name": "TiltCamp",
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
    "AccountSpecificPageUrl1": null,
    "AccountSpecificPageUrl2": null,
    "AccountSpecificPageUrl3": null,
    "AccountSpecificPageUrl4": null,
    "AccountSpecificPageUrl5": null,
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
    "Uid": "BWz8JPQE",
    "Created": "2021-02-04T16:22:11",
    "Updated": "2021-02-06T18:09:24"
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
  "StartDate": "2021-02-06T17:49:51",
  "EndDate": "2021-02-06T18:09:24",
  "RenewalDate": null,
  "NewRequiredQuantity": null,
  "IsPlanUpgradeRequired": false,
  "PlanUpgradeRequiredMessage": null,
  "SubscriptionAddOns": [
    {
      "BillingRenewalTerm": 1,
      "Subscription": null,
      "AddOn": null,
      "Quantity": null,
      "StartDate": "2021-02-06T17:49:51",
      "EndDate": "2021-02-06T18:09:24",
      "RenewalDate": null,
      "NewRequiredQuantity": null,
      "Uid": "OW4kvY9g",
      "Created": "2021-02-06T17:49:51",
      "Updated": "2021-02-06T18:09:24"
    }
  ],
  "DiscountCouponSubscriptions": [

  ],
  "Uid": "rmkG72mg",
  "Created": "2021-02-06T17:49:51",
  "Updated": "2021-02-06T18:09:24"
};

const exampleFailure = {
  "ErrorMessage": "Could not convert hash g to long",
  "EntityValidationErrors" :[]
};
