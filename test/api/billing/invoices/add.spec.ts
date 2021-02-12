import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import Invoices from '../../../../src/api/billing/invoices';
import { UserCredentials, ServerCredentials } from '../../../../src/util/credentials';
import ValidationError from '../../../../src/models/wrappers/validation-error';
import Invoice from '../../../../src/models/billing/invoice';

describe('api', () => {
  describe('Billing', () => {
    describe('Invoices', () => {
      describe('add', () => {
        let server: Pretender;
        let store: Store;

        let invoices: Invoices;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          invoices = new Invoices(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              "Subscription": {
                "Uid": "dQGxEz94"
              },
              "InvoiceDate": '2021-12-29T08:00:00.000Z',
              "InvoiceLineItems": [
                {
                  "Description": "Example Item",
                  "Amount": 50
                }
              ]
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/billing/invoices', responseHandler);
          });

          const response = await invoices.add({
            "Subscription": {
              "Uid": "dQGxEz94"
            },
            "InvoiceDate": new Date('2021-12-29T08:00:00.000Z'),
            "InvoiceLineItems": [
              {
                "Description": "Example Item",
                "Amount": 50
              }
            ]
          }) as Invoice;

          expect(response.Number).toBe(1002);
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              "Subscription": {
                "Uid": "dQGxEz94"
              },
              "InvoiceDate": '2021-12-29T08:00:00.000Z',
              "InvoiceLineItems": []
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/billing/invoices', responseHandler);
          });

          const response = await invoices.add({
            "Subscription": {
              "Uid": "dQGxEz94"
            },
            "InvoiceDate": new Date('2021-12-29T08:00:00.000Z'),
            "InvoiceLineItems": []
          }) as ValidationError<Invoice>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "An invoice must have one or multiple line items.",
            PropertyName: "InvoiceLineItems"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              "Subscription": {
                "Uid": "malformed"
              },
              "InvoiceDate": '2021-12-29T08:00:00.000Z',
              "InvoiceLineItems": []
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/billing/invoices', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await invoices.add({
              "Subscription": {
                "Uid": "malformed"
              },
              "InvoiceDate": new Date('2021-12-29T08:00:00.000Z'),
              "InvoiceLineItems": []
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
  "InvoiceDate": "2021-02-11T17:19:51.703Z",
  "PaymentReminderSentDate": null,
  "Number": 1002,
  "BillingInvoiceStatus": 1,
  "Subscription": {
    "BillingRenewalTerm": 1,
    "Account": null,
    "Plan": null,
    "Quantity": null,
    "StartDate": "2021-02-07T21:58:52",
    "EndDate": null,
    "RenewalDate": "2021-02-14T21:58:52",
    "NewRequiredQuantity": null,
    "IsPlanUpgradeRequired": false,
    "PlanUpgradeRequiredMessage": null,
    "SubscriptionAddOns": null,
    "DiscountCouponSubscriptions": null,
    "Uid": "dQGxEz94",
    "Created": "2021-02-07T21:58:52",
    "Updated": "2021-02-07T21:58:52"
  },
  "Amount": 50.0,
  "AmountOutstanding": 50.0,
  "InvoiceLineItems": [
    {
      "StartDate": null,
      "EndDate": null,
      "Description": "Example Item",
      "UnitOfMeasure": "",
      "Quantity": null,
      "Rate": 0.0,
      "Amount": 50.0,
      "Tax": 0.0,
      "Invoice": null,
      "LineItemType": 0,
      "LineItemEntityUid": null,
      "Uid": "j9bYGwQn",
      "Created": "2021-02-11T17:20:21.3168752Z",
      "Updated": "2021-02-11T17:20:21.3168752Z"
    }
  ],
  "IsUserGenerated": true,
  "Uid": "wmjJoKmV",
  "Created": "2021-02-11T17:20:21.3168752Z",
  "Updated": "2021-02-11T17:20:21.3168752Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
        "InvoiceDate": "2021-12-29T08:00:00Z",
        "PaymentReminderSentDate": null,
        "Number": 1007,
        "BillingInvoiceStatus": 1,
        "Subscription": {
          "BillingRenewalTerm": 1,
          "Account": null,
          "Plan": null,
          "Quantity": null,
          "StartDate": "2021-02-07T21:58:52",
          "EndDate": null,
          "RenewalDate": "2021-02-14T21:58:52",
          "NewRequiredQuantity": null,
          "IsPlanUpgradeRequired": false,
          "PlanUpgradeRequiredMessage": null,
          "SubscriptionAddOns": null,
          "DiscountCouponSubscriptions": null,
          "Uid": "dQGxEz94",
          "Created": "2021-02-07T21:58:52",
          "Updated": "2021-02-07T21:58:52"
        },
        "Amount": 0.0,
        "AmountOutstanding": 0.0,
        "InvoiceLineItems": [],
        "IsUserGenerated": true,
        "Uid": null,
        "Created": "0001-01-01T00:00:00",
        "Updated": "0001-01-01T00:00:00"
      },
      "TypeName": "Invoice",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "An invoice must have one or multiple line items.",
          "PropertyName": "InvoiceLineItems"
        }
      ]
    }
  ]
};
