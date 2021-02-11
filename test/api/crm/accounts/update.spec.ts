import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import Accounts from '../../../../src/api/crm/accounts';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import AccountModel from '../../../../src/models/crm/account';
import ValidationError from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('update', () => {
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
              Uid: 'BWz87NQE',
              Name: 'TiltCamp Rebranded'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/BWz87NQE', responseHandler);
          });

          const response = await accounts.update({
            Uid: 'BWz87NQE',
            Name: 'TiltCamp Rebranded'
          }) as AccountModel;

          expect(response.Name).toBe('TiltCamp Rebranded');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'BWz87NQE',
              Name: 'TiltCamp Rebranded'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/BWz87NQE', responseHandler);
          });

          const response = await accounts.update({
            Uid: 'BWz87NQE',
            Name: 'TiltCamp Rebranded'
          }, {
            fields: '*'
          }) as AccountModel;

          expect(response.Name).toBe('TiltCamp Rebranded');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*,PersonAccount.*,PersonAccount.Person.Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'BWz87NQE',
              Name: ''
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/BWz87NQE', responseHandler);
          });

          const response = await accounts.update({
            Uid: 'BWz87NQE',
            Name: ''
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
              Uid: 'BWz87NQE',
              AccountStage: -1
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/BWz87NQE', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.update({
              Uid: 'BWz87NQE',
              AccountStage: -1
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
  "Name": "TiltCamp Rebranded",
  "ClientIdentifier": null,
  "IsDemo": false,
  "BillingAddress": {
    "AddressLine1": null,
    "AddressLine2": null,
    "AddressLine3": null,
    "City": "",
    "State": "765",
    "PostalCode": "",
    "Country": null,
    "Uid": "rmk1e19g",
    "Created": "2021-02-02T05:56:48",
    "Updated": "2021-02-02T05:56:48"
  },
  "MailingAddress": null,
  "AccountStage": 9,
  "PaymentInformation": null,
  "PersonAccount": [
    {
      "Person": null,
      "Account": null,
      "IsPrimary": false,
      "Uid": "XQYa64QP",
      "Created": "2021-02-02T06:16:06",
      "Updated": "2021-02-02T06:16:06"
    }
  ],
  "Subscriptions": [],
  "Deals": [],
  "LastLoginDateTime": null,
  "AccountSpecificPageUrl1": null,
  "AccountSpecificPageUrl2": null,
  "AccountSpecificPageUrl3": null,
  "AccountSpecificPageUrl4": null,
  "AccountSpecificPageUrl5": null,
  "RewardFulReferralId": null,
  "HasLoggedIn": false,
  "AccountStageLabel": "9",
  "DomainName": null,
  "LatestSubscription": null,
  "CurrentSubscription": null,
  "PrimaryContact": null,
  "PrimarySubscription": null,
  "RecaptchaToken": null,
  "LifetimeRevenue": 0.0,
  "Uid": "BWz87NQE",
  "Created": "2021-02-02T05:19:46",
  "Updated": "2021-02-02T17:49:58.706488Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Name": "",
        "ClientIdentifier": null,
        "IsDemo": false,
        "BillingAddress": {
          "AddressLine1": null,
          "AddressLine2": null,
          "AddressLine3": null,
          "City": "",
          "State": "765",
          "PostalCode": "",
          "Country": null,
          "Uid": "rmk1e19g",
          "Created": "2021-02-02T05:56:48",
          "Updated": "2021-02-02T05:56:48"
        },
        "MailingAddress": null,
        "AccountStage": 9,
        "PaymentInformation": null,
        "PersonAccount": [
          {
            "Person": null,
            "Account": null,
            "IsPrimary": false,
            "Uid": "XQYa64QP",
            "Created": "2021-02-02T06:16:06",
            "Updated": "2021-02-02T06:16:06"
          }
        ],
        "Subscriptions": [],
        "Deals": [],
        "LastLoginDateTime": null,
        "AccountSpecificPageUrl1": null,
        "AccountSpecificPageUrl2": null,
        "AccountSpecificPageUrl3": null,
        "AccountSpecificPageUrl4": null,
        "AccountSpecificPageUrl5": null,
        "RewardFulReferralId": null,
        "HasLoggedIn": false,
        "AccountStageLabel": "9",
        "DomainName": null,
        "LatestSubscription": null,
        "CurrentSubscription": null,
        "PrimaryContact": null,
        "PrimarySubscription": null,
        "RecaptchaToken": null,
        "LifetimeRevenue": 0.0,
        "Uid": "BWz87NQE",
        "Created": "2021-02-02T05:19:46",
        "Updated": "2021-02-02T17:30:19.6628215Z"
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
