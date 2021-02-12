import Pretender, { ResponseHandler } from 'pretender';
import { Subscription } from '../../../../src/models/billing/subscription';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { Store } from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import { Subscriptions } from '../../../../src/api/billing/subscriptions';
import { BillingRenewalTerm } from '../../../../src/models/billing/billing-renewal-term';

describe('api', () => {
  describe('Billing', () => {
    describe('Subscriptions', () => {
      describe('update', () => {
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
              Uid: 'dQGxEz94',
              Plan: {
                Uid: 'wZmNw7Q2'
              },
              Account: {
                Uid: 'nmDAv0Qy'
              },
              SubscriptionAddOns: [],
              BillingRenewalTerm: BillingRenewalTerm.Monthly
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/dQGxEz94/changesubscription', responseHandler);
          });

          const response = await subscriptions.update({
            Uid: 'dQGxEz94',
            Plan: {
              Uid: 'wZmNw7Q2'
            },
            Account: {
              Uid: 'nmDAv0Qy'
            },
            SubscriptionAddOns: [],
            BillingRenewalTerm: BillingRenewalTerm.Monthly
          }) as Subscription;

          expect(response.Uid).toBe('dQGxEz94');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'dQGxEz94',
              Plan: {
                Uid: 'wZmNw7Q2'
              },
              Account: {
                Uid: 'nmDAv0Qy'
              },
              SubscriptionAddOns: [],
              BillingRenewalTerm: BillingRenewalTerm.Monthly
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/dQGxEz94/changesubscription', responseHandler);
          });

          const response = await subscriptions.update({
            Uid: 'dQGxEz94',
            Plan: {
              Uid: 'wZmNw7Q2'
            },
            Account: {
              Uid: 'nmDAv0Qy'
            },
            SubscriptionAddOns: [],
            BillingRenewalTerm: BillingRenewalTerm.Monthly
          }) as ValidationError<Subscription>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "There are no add ons defined.",
            PropertyName: "SubscriptionAddOns"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'dQGxEz94',
              Plan: {
                Uid: 'malformed'
              },
              Account: {
                Uid: 'nmDAv0Qy'
              },
              SubscriptionAddOns: [],
              BillingRenewalTerm: BillingRenewalTerm.Monthly
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/dQGxEz94/changesubscription', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await subscriptions.update({
              Uid: 'dQGxEz94',
              Plan: {
                Uid: 'malformed'
              },
              Account: {
                Uid: 'nmDAv0Qy'
              },
              SubscriptionAddOns: [],
              BillingRenewalTerm: BillingRenewalTerm.Monthly
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
  "BillingRenewalTerm": 2,
  "Account": {
    "Name": null,
    "ClientIdentifier": null,
    "IsDemo": false,
    "BillingAddress": null,
    "MailingAddress": null,
    "AccountStage": 0,
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
    "AccountStageLabel": "0",
    "DomainName": null,
    "LatestSubscription": null,
    "CurrentSubscription": null,
    "PrimaryContact": null,
    "PrimarySubscription": null,
    "RecaptchaToken": null,
    "LifetimeRevenue": 0.0,
    "Uid": "nmDAv0Qy",
    "Created": "0001-01-01T00:00:00",
    "Updated": "0001-01-01T00:00:00"
  },
  "Plan": {
    "Name": null,
    "Description": null,
    "PlanFamily": null,
    "IsQuantityEditable": false,
    "MinimumQuantity": 0,
    "MonthlyRate": 0.0,
    "AnnualRate": 0.0,
    "SetupFee": 0.0,
    "IsTaxable": false,
    "IsActive": false,
    "TrialPeriodDays": 0,
    "UnitOfMeasure": "",
    "PlanAddOns": null,
    "ContentGroups": null,
    "NumberOfSubscriptions": 0,
    "Uid": "wZmNw7Q2",
    "Created": "0001-01-01T00:00:00",
    "Updated": "0001-01-01T00:00:00"
  },
  "Quantity": null,
  "StartDate": "2021-02-12T04:52:38.0174484Z",
  "EndDate": null,
  "RenewalDate": null,
  "NewRequiredQuantity": null,
  "IsPlanUpgradeRequired": false,
  "PlanUpgradeRequiredMessage": null,
  "SubscriptionAddOns": [],
  "DiscountCouponSubscriptions": [],
  "Uid": "dQGxEz94",
  "Created": "0001-01-01T00:00:00",
  "Updated": "0001-01-01T00:00:00"
};

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
        "BillingRenewalTerm": 2,
        "Account": {
          "Name": null,
          "ClientIdentifier": null,
          "IsDemo": false,
          "BillingAddress": null,
          "MailingAddress": null,
          "AccountStage": 0,
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
          "AccountStageLabel": "0",
          "DomainName": null,
          "LatestSubscription": null,
          "CurrentSubscription": null,
          "PrimaryContact": null,
          "PrimarySubscription": null,
          "RecaptchaToken": null,
          "LifetimeRevenue": 0.0,
          "Uid": "nmDAv0Qy",
          "Created": "0001-01-01T00:00:00",
          "Updated": "0001-01-01T00:00:00"
        },
        "Plan": {
          "Name": null,
          "Description": null,
          "PlanFamily": null,
          "IsQuantityEditable": false,
          "MinimumQuantity": 0,
          "MonthlyRate": 0.0,
          "AnnualRate": 0.0,
          "SetupFee": 0.0,
          "IsTaxable": false,
          "IsActive": false,
          "TrialPeriodDays": 0,
          "UnitOfMeasure": "",
          "PlanAddOns": null,
          "ContentGroups": null,
          "NumberOfSubscriptions": 0,
          "Uid": "wZmNw7Q2",
          "Created": "0001-01-01T00:00:00",
          "Updated": "0001-01-01T00:00:00"
        },
        "Quantity": null,
        "StartDate": "2021-02-12T00:08:42.9074755Z",
        "EndDate": null,
        "RenewalDate": null,
        "NewRequiredQuantity": null,
        "IsPlanUpgradeRequired": false,
        "PlanUpgradeRequiredMessage": null,
        "SubscriptionAddOns": [],
        "DiscountCouponSubscriptions": [],
        "Uid": "dQGxEz94",
        "Created": "0001-01-01T00:00:00",
        "Updated": "0001-01-01T00:00:00"
      },
      "TypeName": "Subscription",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "There are no add ons defined.",
          "PropertyName": "SubscriptionAddOns"
        }
      ]
    }
  ]
};
