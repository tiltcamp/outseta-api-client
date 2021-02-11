import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import Subscriptions from '../../../../src/api/billing/subscriptions';
import { BillingRenewalTerm } from '../../../../src/models/billing/billing-renewal-term';
import ValidationError from '../../../../src/models/wrappers/validation-error';
import Subscription from '../../../../src/models/billing/subscription';

describe('api', () => {
  describe('Billing', () => {
    describe('Subscriptions', () => {
      describe('add', () => {
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
              Account: {
                Uid: 'Rm8EkZQ4'
              },
              BillingRenewalTerm: BillingRenewalTerm.Monthly,
              Plan: {
                Uid: 'wZmNw7Q2'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/firsttimesubscription', responseHandler);
          });

          const response = await subscriptions.add({
            Account: {
              Uid: 'Rm8EkZQ4'
            },
            BillingRenewalTerm: BillingRenewalTerm.Monthly,
            Plan: {
              Uid: 'wZmNw7Q2'
            }
          }) as Subscription;

          expect(response.Account.Name).toBe('TiltCamp and Friends');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Account: {
                Uid: 'Rm8EkZQ4'
              },
              BillingRenewalTerm: BillingRenewalTerm.Monthly,
              Plan: {
                Uid: 'wZmNw7Q2'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/firsttimesubscription', responseHandler);
          });

          const response = await subscriptions.add({
            Account: {
              Uid: 'Rm8EkZQ4'
            },
            BillingRenewalTerm: BillingRenewalTerm.Monthly,
            Plan: {
              Uid: 'wZmNw7Q2'
            }
          }) as ValidationError<Subscription>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "There is an active subscription already for this account.",
            PropertyName: "Subscription"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Account: {
                Uid: 'malformed'
              },
              BillingRenewalTerm: BillingRenewalTerm.Monthly,
              Plan: {
                Uid: 'malformed'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/billing/subscriptions/firsttimesubscription', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await subscriptions.add({
              Account: {
                Uid: 'malformed'
              },
              BillingRenewalTerm: BillingRenewalTerm.Monthly,
              Plan: {
                Uid: 'malformed'
              }
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
    "Name": "TiltCamp and Friends",
    "ClientIdentifier": null,
    "IsDemo": false,
    "BillingAddress": null,
    "MailingAddress": null,
    "AccountStage": 2,
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
    "AccountStageLabel": "Trialing",
    "DomainName": null,
    "LatestSubscription": null,
    "CurrentSubscription": null,
    "PrimaryContact": null,
    "PrimarySubscription": null,
    "RecaptchaToken": null,
    "LifetimeRevenue": 0.0,
    "Uid": "LmJ83p9P",
    "Created": "2021-02-07T19:18:56",
    "Updated": "2021-02-07T19:18:56"
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
  "StartDate": "2021-02-07T19:19:12.6601284Z",
  "EndDate": null,
  "RenewalDate": "2021-02-14T19:19:12.6601284Z",
  "NewRequiredQuantity": null,
  "IsPlanUpgradeRequired": false,
  "PlanUpgradeRequiredMessage": null,
  "SubscriptionAddOns": [
    {
      "BillingRenewalTerm": 1,
      "Subscription": null,
      "AddOn": null,
      "Quantity": null,
      "StartDate": "2021-02-07T19:19:12.6601284Z",
      "EndDate": null,
      "RenewalDate": "2021-03-07T19:19:12.6601284Z",
      "NewRequiredQuantity": null,
      "Uid": "zWZ5XM9p",
      "Created": "2021-02-07T19:19:12.6913544Z",
      "Updated": "2021-02-07T19:19:12.6913544Z"
    }
  ],
  "DiscountCouponSubscriptions": [],
  "Uid": "Rm8EkZQ4",
  "Created": "2021-02-07T19:19:12.6913544Z",
  "Updated": "2021-02-07T19:19:12.6913544Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
        "BillingRenewalTerm": 1,
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
          "Uid": "BWz8JPQE",
          "Created": "0001-01-01T00:00:00",
          "Updated": "0001-01-01T00:00:00"
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
        "StartDate": "2021-02-06T21:32:55.6273027Z",
        "EndDate": null,
        "RenewalDate": "2021-02-13T21:32:55.6273027Z",
        "NewRequiredQuantity": null,
        "IsPlanUpgradeRequired": false,
        "PlanUpgradeRequiredMessage": null,
        "SubscriptionAddOns": [],
        "DiscountCouponSubscriptions": [],
        "Uid": null,
        "Created": "0001-01-01T00:00:00",
        "Updated": "0001-01-01T00:00:00"
      },
      "TypeName": "Subscription",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "There is an active subscription already for this account.",
          "PropertyName": "Subscription"
        }
      ]
    }
  ]
};
