import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import { Accounts } from '../../../../src/api/crm/accounts';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { Subscription } from '../../../../src/models/billing/subscription';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('extendTrial', () => {
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
            expect(JSON.parse(request.requestBody)).toEqual({ ToDate: '2021-12-29T08:00:00.000Z' });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              exampleResponse
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/jW7GJVWq/extend-trial', responseHandler);
          });

          const response = await accounts.extendTrial('jW7GJVWq', new Date('2021-12-29T08:00:00.000Z'));
          expect(response).toBeNull();
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({ ToDate: '2021-12-29T08:00:00.000Z' });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/jW7GJVWq/extend-trial', responseHandler);
          });

          const response = await accounts.extendTrial('jW7GJVWq', new Date('2021-12-29T08:00:00.000Z')) as ValidationError<Subscription>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "The account need to be in trial or an expired trial to extend the term.",
            PropertyName: "AccountStage"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({ ToDate: '2021-12-29T08:00:00.000Z' });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              404,
              {'Content-Type': 'application/json'},
              ''
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/jW7GJVWq/extend-trial', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.extendTrial('jW7GJVWq', new Date('2021-12-29T08:00:00.000Z'));
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
        "BillingRenewalTerm": 1,
        "Account": {
          "Name": "Best Co.",
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
          "Uid": "jW7GJVWq",
          "Created": "2021-02-10T17:04:00",
          "Updated": "2021-02-11T03:39:17"
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
        "StartDate": "2021-02-11T03:39:17",
        "EndDate": null,
        "RenewalDate": "2021-03-11T03:39:17",
        "NewRequiredQuantity": null,
        "IsPlanUpgradeRequired": false,
        "PlanUpgradeRequiredMessage": null,
        "SubscriptionAddOns": [
          {
            "BillingRenewalTerm": 1,
            "Subscription": null,
            "AddOn": null,
            "Quantity": null,
            "StartDate": "2021-02-11T03:39:17",
            "EndDate": null,
            "RenewalDate": "2021-03-11T03:39:17",
            "NewRequiredQuantity": null,
            "Uid": "yW1xyj9B",
            "Created": "2021-02-11T03:39:17",
            "Updated": "2021-02-11T03:39:17"
          }
        ],
        "DiscountCouponSubscriptions": [],
        "Uid": "pWrK6Lmn",
        "Created": "2021-02-11T03:39:17",
        "Updated": "2021-02-11T03:39:17"
      },
      "TypeName": "Subscription",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "The account need to be in trial or an expired trial to extend the term.",
          "PropertyName": "AccountStage"
        }
      ]
    }
  ]
};
