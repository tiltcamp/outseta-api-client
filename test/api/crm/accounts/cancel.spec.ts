import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import Accounts from '../../../../src/api/crm/accounts';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import ValidationError from '../../../../src/models/wrappers/validation-error';
import AccountModel from '../../../../src/models/crm/account';

describe('api', () => {
  describe('Crm', () => {
    describe('Accounts', () => {
      describe('cancel', () => {
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
            expect(JSON.parse(request.requestBody)).toEqual({
              CancelationReason: 'test cancelation reason',
              Account: {
                Uid: 'BWz87NQE'
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
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/cancellation/BWz87NQE', responseHandler);
          });

          const response = await accounts.cancel({
            CancelationReason: 'test cancelation reason',
            Account: {
              Uid: 'BWz87NQE'
            }
          });

          expect(response).toBeNull();
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              CancelationReason: 'test cancelation reason',
              Account: {
                Uid: 'BWz87NQE'
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
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/cancellation/BWz87NQE', responseHandler);
          });

          const response = await accounts.cancel({
            CancelationReason: 'test cancelation reason',
            Account: {
              Uid: 'BWz87NQE'
            }
          }) as ValidationError<AccountModel>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "An account needs to be in a subscribing or trialing state to request cancelation.",
            PropertyName: "AccountStage"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              CancelationReason: 'test cancelation reason',
              Account: {
                Uid: 'BWz87NQE'
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
            this.put('https://test-company.outseta.com/api/v1/crm/accounts/cancellation/BWz87NQE', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await accounts.cancel({
              CancelationReason: 'test cancelation reason',
              Account: {
                Uid: 'BWz87NQE'
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

const exampleResponse = '';

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
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
        "AccountStage": 4,
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
        "Subscriptions": [

        ],
        "Deals": [

        ],
        "LastLoginDateTime": null,
        "AccountSpecificPageUrl1": null,
        "AccountSpecificPageUrl2": null,
        "AccountSpecificPageUrl3": null,
        "AccountSpecificPageUrl4": null,
        "AccountSpecificPageUrl5": null,
        "RewardFulReferralId": null,
        "HasLoggedIn": false,
        "AccountStageLabel": "Cancelling",
        "DomainName": null,
        "LatestSubscription": null,
        "CurrentSubscription": null,
        "PrimaryContact": null,
        "PrimarySubscription": null,
        "RecaptchaToken": null,
        "LifetimeRevenue": 0.0,
        "Uid": "BWz87NQE",
        "Created": "2021-02-02T05:19:46",
        "Updated": "2021-02-02T18:29:55"
      },
      "TypeName": "Account",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "An account needs to be in a subscribing or trialing state to request cancelation.",
          "PropertyName": "AccountStage"
        }
      ]
    }
  ]
};
