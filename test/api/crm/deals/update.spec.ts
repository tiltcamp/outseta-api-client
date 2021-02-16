import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { Deals } from '../../../../src/api/crm/deals';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Deal } from '../../../../src/models/crm/deal';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Crm', () => {
    describe('Deals', () => {
      describe('update', () => {
        let server: Pretender;
        let store: Store;

        let deals: Deals;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          deals = new Deals(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'Rm8pvym4',
              Name: 'New Deal Name'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/deals/Rm8pvym4', responseHandler);
          });

          const response = await deals.update({
            Uid: 'Rm8pvym4',
            Name: 'New Deal Name'
          }) as Deal;

          expect(response.Name).toBe('New Deal Name');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: 'Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'Rm8pvym4',
              Name: 'New Deal Name'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/deals/Rm8pvym4', responseHandler);
          });

          const response = await deals.update({
            Uid: 'Rm8pvym4',
            Name: 'New Deal Name'
          }, {
            fields: 'Uid'
          }) as Deal;

          expect(response.Uid).toBe('Rm8pvym4');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'Rm8pvym4',
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
            this.put('https://test-company.outseta.com/api/v1/crm/deals/Rm8pvym4', responseHandler);
          });

          const response = await deals.update({
            Uid: 'Rm8pvym4',
            Name: ''
          }) as ValidationError<Deal>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "required",
            ErrorMessage: "The Name field is required.",
            PropertyName: "Name"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'malformed'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/deals/malformed', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await deals.update({
              Uid: 'malformed'
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
  "Name": "New Deal Name",
  "Amount": 100000.00,
  "DueDate": "2021-02-15T08:00:00",
  "AssignedToPersonClientIdentifier": "Rm8rb7y9",
  "Weight": 0,
  "DealPipelineStage": null,
  "Account": null,
  "DealPeople": null,
  "Contacts": "hello@tiltcamp.com",
  "Owner": null,
  "Uid": "Rm8pvym4",
  "Created": "2021-02-15T20:59:07",
  "Updated": "2021-02-15T23:10:52.5430173Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Name": "",
        "Amount": 100000.00,
        "DueDate": "2021-02-15T08:00:00",
        "AssignedToPersonClientIdentifier": "Rm8rb7y9",
        "Weight": 0,
        "DealPipelineStage": {
          "Weight": 2,
          "Name": "Test Stage 2",
          "DealPipeline": null,
          "Deals": null,
          "Uid": "qNmdZA90",
          "Created": "2021-02-15T20:57:18",
          "Updated": "2021-02-15T20:57:18"
        },
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
          "Updated": "2021-02-13T17:48:57"
        },
        "DealPeople": [
          {
            "Person": null,
            "Deal": null,
            "Uid": "jW7qk4Qq",
            "Created": "2021-02-15T20:59:07",
            "Updated": "2021-02-15T20:59:07"
          }
        ],
        "Contacts": "hello@tiltcamp.com",
        "Owner": null,
        "Uid": "Rm8pvym4",
        "Created": "2021-02-15T20:59:07",
        "Updated": "2021-02-15T23:09:41.3975087Z"
      },
      "TypeName": "Deal",
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
