import Pretender, { ResponseHandler } from 'pretender';
import { Usage } from '../../../../src/api/billing/usage';
import { UsageItem } from '../../../../src/models/billing/usage-item';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Billing', () => {
    describe('Usage', () => {
      describe('add', () => {
        let server: Pretender;
        let store: Store;

        let usage: Usage;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          usage = new Usage(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Usage.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              UsageDate: "2021-01-01T08:00:00.000Z",
              Amount: 28,
              SubscriptionAddOn: {
                Uid: "z9MKvMm4"
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
            this.post('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          const response = await usage.add({
            UsageDate: new Date("2021-01-01T08:00:00.000Z"),
            Amount: 28,
            SubscriptionAddOn: {
              Uid: "z9MKvMm4"
            }
          }) as UsageItem;

          expect(response.Uid).toBe('y9goyb9M');
          expect(response.Amount).toBe(28.0);
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: '*' });
            expect(JSON.parse(request.requestBody)).toEqual({
              UsageDate: "2021-01-01T08:00:00.000Z",
              Amount: 28,
              SubscriptionAddOn: {
                Uid: "z9MKvMm4"
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
            this.post('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          const response = await usage.add({
            UsageDate: new Date("2021-01-01T08:00:00.000Z"),
            Amount: 28,
            SubscriptionAddOn: {
              Uid: "z9MKvMm4"
            }
          }, {
            fields: '*'
          }) as UsageItem;

          expect(response.Uid).toBe('y9goyb9M');
          expect(response.Amount).toBe(28.0);
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Usage.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              UsageDate: "2021-01-01T08:00:00.000Z",
              Amount: -1,
              SubscriptionAddOn: {
                Uid: "z9MKvMm4"
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
            this.post('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          const response = await usage.add({
            UsageDate: new Date("2021-01-01T08:00:00.000Z"),
            Amount: -1,
            SubscriptionAddOn: {
              Uid: "z9MKvMm4"
            }
          }) as ValidationError<UsageItem>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "Amount need to be great than zero",
            PropertyName: "Amount"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Usage.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              UsageDate: "2021-01-01T08:00:00.000Z",
              Amount: 28,
              SubscriptionAddOn: {
                Uid: "malformed"
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
            this.post('https://test-company.outseta.com/api/v1/billing/usage', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await usage.add({
              UsageDate: new Date("2021-01-01T08:00:00.000Z"),
              Amount: 28,
              SubscriptionAddOn: {
                Uid: "malformed"
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
  "UsageDate": "2017-12-01T18:00:00Z",
  "Invoice": null,
  "SubscriptionAddOn": {
    "BillingRenewalTerm": 1,
    "Subscription": {
      "Account": {
        "Uid": "amRdzZ9J"
      },
      "Uid": "OW48KRWg"
    },
    "AddOn": {
      "Uid": "3wQX0kQK"
    },
    "Quantity": null,
    "StartDate": "2021-02-13T05:08:29",
    "EndDate": null,
    "RenewalDate": "2021-03-13T05:08:29",
    "NewRequiredQuantity": null,
    "Uid": "z9MKvMm4",
    "Created": "2021-02-13T05:08:29",
    "Updated": "2021-02-13T05:08:29"
  },
  "Amount": 28.0,
  "Uid": "y9goyb9M",
  "Created": "2021-02-13T22:39:10.4482952Z",
  "Updated": "2021-02-13T22:39:10.4482952Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
        "UsageDate": "2021-02-14T22:31:45.827Z",
        "Invoice": null,
        "SubscriptionAddOn": {
          "BillingRenewalTerm": 1,
          "Subscription": null,
          "AddOn": null,
          "Quantity": null,
          "StartDate": "2021-02-13T17:48:57",
          "EndDate": null,
          "RenewalDate": "2021-03-13T17:48:57",
          "NewRequiredQuantity": null,
          "Uid": "LmJv3PmP",
          "Created": "2021-02-13T17:48:57",
          "Updated": "2021-02-13T17:48:57"
        },
        "Amount": -1.0,
        "Uid": null,
        "Created": "0001-01-01T00:00:00",
        "Updated": "0001-01-01T00:00:00"
      },
      "TypeName": "Usage",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "Amount need to be great than zero",
          "PropertyName": "Amount"
        }
      ]
    }
  ]
};
