import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import Accounts from '../../../../src/api/crm/accounts';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { AccountStage } from '../../../../src/models/crm/account-stage';
import AccountModel from '../../../../src/models/crm/account';
import ValidationError from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('add', () => {
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
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: 'TiltCamp',
              AccountStage: AccountStage.Trialing,
              PersonAccount: [{
                Person: {
                  Email: 'hello@tiltcamp.com'
                },
                IsPrimary: true
              }]
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/accounts', responseHandler);
          });

          const response = await accounts.add({
            Name: 'TiltCamp',
            AccountStage: AccountStage.Trialing,
            PersonAccount: [{
              Person: {
                Email: 'hello@tiltcamp.com'
              },
              IsPrimary: true
            }]
          }) as AccountModel;

          expect(response.Name).toBe('TiltCamp');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: 'TiltCamp',
              AccountStage: AccountStage.Trialing,
              PersonAccount: [{
                Person: {
                  Email: 'hello@tiltcamp.com'
                },
                IsPrimary: true
              }]
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/accounts', responseHandler);
          });

          const response = await accounts.add({
            Name: 'TiltCamp',
            AccountStage: AccountStage.Trialing,
            PersonAccount: [{
              Person: {
                Email: 'hello@tiltcamp.com'
              },
              IsPrimary: true
            }]
          }, {
            fields: '*'
          }) as AccountModel;

          expect(response.Name).toBe('TiltCamp');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*,PersonAccount.*,PersonAccount.Person.Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: '',
              AccountStage: AccountStage.Trialing,
              PersonAccount: [{
                Person: {
                  Email: 'hello@tiltcamp.com'
                },
                IsPrimary: true
              }]
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/accounts', responseHandler);
          });

          const response = await accounts.add({
            Name: '',
            AccountStage: AccountStage.Trialing,
            PersonAccount: [{
              Person: {
                Email: 'hello@tiltcamp.com'
              },
              IsPrimary: true
            }]
          }) as ValidationError<AccountModel>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "required",
            ErrorMessage: "The Name field is required.",
            PropertyName: "Name"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*,PersonAccount.*,PersonAccount.Person.Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: 'malformed request',
              AccountStage: -1,
              PersonAccount: []
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/accounts', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.add({
              Name: 'malformed request',
              AccountStage: -1,
              PersonAccount: []
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
  "Name": "TiltCamp",
  "ClientIdentifier": null,
  "IsDemo": false,
  "BillingAddress": null,
  "MailingAddress": null,
  "AccountStage": 2,
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
  "AccountStageLabel": "Trialing",
  "DomainName": null,
  "LatestSubscription": null,
  "CurrentSubscription": null,
  "PrimaryContact": null,
  "PrimarySubscription": null,
  "RecaptchaToken": null,
  "LifetimeRevenue": 0.0,
  "Uid": "BWz8JPQE",
  "Created": "2021-02-04T16:22:10.8860898Z",
  "Updated": "2021-02-04T16:22:10.8860898Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Name": null,
        "ClientIdentifier": null,
        "IsDemo": false,
        "BillingAddress": null,
        "MailingAddress": null,
        "AccountStage": 2,
        "PaymentInformation": null,
        "PersonAccount": [
          {
            "Person": {
              "Email": null,
              "FirstName": "",
              "LastName": "",
              "MailingAddress": null,
              "PasswordMustChange": false,
              "PhoneMobile": "",
              "PhoneWork": "",
              "Title": null,
              "Timezone": null,
              "Language": null,
              "IPAddress": null,
              "Referer": null,
              "UserAgent": null,
              "LastLoginDateTime": null,
              "OAuthGoogleProfileId": null,
              "PersonAccount": [

              ],
              "DealPeople": null,
              "Account": null,
              "FullName": "Unknown",
              "OAuthIntegrationStatus": 0,
              "UserAgentPlatformBrowser": "",
              "Uid": null,
              "Created": "2021-01-28T06:32:43.2205198Z",
              "Updated": "2021-01-28T06:32:43.2205198Z"
            },
            "IsPrimary": true,
            "Uid": null,
            "Created": "2021-01-28T06:32:43.2205198Z",
            "Updated": "2021-01-28T06:32:43.2205198Z"
          }
        ],
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
        "AccountStageLabel": "Trialing",
        "DomainName": null,
        "LatestSubscription": null,
        "CurrentSubscription": null,
        "PrimaryContact": null,
        "PrimarySubscription": null,
        "RecaptchaToken": null,
        "LifetimeRevenue": 0.0,
        "Uid": null,
        "Created": "2021-01-28T06:32:43.2205198Z",
        "Updated": "2021-01-28T06:32:43.2205198Z"
      },
      "TypeName": "Account",
      "ValidationErrors": [
        {
          "ErrorCode": "required",
          "ErrorMessage": "The Name field is required.",
          "PropertyName": "Name"
        }
      ]
    }
  ]
};
