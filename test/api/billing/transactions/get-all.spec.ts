import Pretender, { ResponseHandler } from 'pretender';
import { Transactions } from '../../../../src/api/billing/transactions';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Billing', () => {
    describe('Transactions', () => {
      describe('getAll', () => {
        let server: Pretender;
        let store: Store;

        let transactions: Transactions;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          transactions = new Transactions(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/transactions/nmDAv0Qy', responseHandler);
          });

          const response = await transactions.getAll('nmDAv0Qy');
          expect(response.metadata.total).toBe(7);
          expect(response.items).toHaveSize(7);
          expect(response.items[0].Uid).toBe('jW77V4Wq');
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({"Message": "An error has occurred."})
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/transactions/nmDAv0Qy', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await transactions.getAll('nmDAv0Qy');
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
  "metadata": {
    "limit": 100,
    "offset": 0,
    "total": 7
  },
  "items": [
    {
      "TransactionDate": "2021-02-11T17:08:02",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-02-11T17:08:02",
        "PaymentReminderSentDate": null,
        "Number": 1001,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": 30.00,
        "AmountOutstanding": 30.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "49ED0JQ7",
        "Created": "2021-02-11T17:08:25",
        "Updated": "2021-02-11T21:02:58"
      },
      "Amount": 30.00,
      "IsElectronicTransaction": false,
      "Uid": "jW77V4Wq",
      "Created": "2021-02-11T17:08:25",
      "Updated": "2021-02-11T17:08:25"
    },
    {
      "TransactionDate": "2021-02-11T17:19:52",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-02-11T17:19:52",
        "PaymentReminderSentDate": null,
        "Number": 1002,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": 50.00,
        "AmountOutstanding": 50.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "wmjJoKmV",
        "Created": "2021-02-11T17:20:21",
        "Updated": "2021-02-11T21:02:59"
      },
      "Amount": 50.00,
      "IsElectronicTransaction": false,
      "Uid": "BWz47wQE",
      "Created": "2021-02-11T17:20:21",
      "Updated": "2021-02-11T17:20:21"
    },
    {
      "TransactionDate": "2021-02-11T17:19:52",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-02-11T17:19:52",
        "PaymentReminderSentDate": null,
        "Number": 1003,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": 50.00,
        "AmountOutstanding": 50.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "nmDXPxmy",
        "Created": "2021-02-11T19:12:21",
        "Updated": "2021-02-11T21:02:59"
      },
      "Amount": 50.00,
      "IsElectronicTransaction": false,
      "Uid": "7maKg29E",
      "Created": "2021-02-11T19:12:21",
      "Updated": "2021-02-11T19:12:21"
    },
    {
      "TransactionDate": "2021-02-11T17:19:52",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-02-11T17:19:52",
        "PaymentReminderSentDate": null,
        "Number": 1004,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": 50.00,
        "AmountOutstanding": 50.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "BWz5kg9E",
        "Created": "2021-02-11T19:15:03",
        "Updated": "2021-02-11T21:02:59"
      },
      "Amount": 50.00,
      "IsElectronicTransaction": false,
      "Uid": "496el0QX",
      "Created": "2021-02-11T19:15:03",
      "Updated": "2021-02-11T19:15:03"
    },
    {
      "TransactionDate": "2021-12-29T08:00:00",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-12-29T08:00:00",
        "PaymentReminderSentDate": null,
        "Number": 1005,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": 50.00,
        "AmountOutstanding": 50.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "ZmNv3Em2",
        "Created": "2021-02-11T19:15:47",
        "Updated": "2021-02-11T21:02:59"
      },
      "Amount": 50.00,
      "IsElectronicTransaction": false,
      "Uid": "y9qRaKWA",
      "Created": "2021-02-11T19:15:47",
      "Updated": "2021-02-11T19:15:47"
    },
    {
      "TransactionDate": "2021-12-29T08:00:00",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-12-29T08:00:00",
        "PaymentReminderSentDate": null,
        "Number": 1006,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": -50.00,
        "AmountOutstanding": -50.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "y9qJE2WA",
        "Created": "2021-02-11T19:18:45",
        "Updated": "2021-02-11T19:18:45"
      },
      "Amount": -50.00,
      "IsElectronicTransaction": false,
      "Uid": "XQYZgX9P",
      "Created": "2021-02-11T19:18:45",
      "Updated": "2021-02-11T19:18:45"
    },
    {
      "TransactionDate": "2021-12-29T08:00:00",
      "BillingTransactionType": 1,
      "Account": {
        "Name": "TiltCamp Co.",
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
        "Uid": "nmDAv0Qy",
        "Created": "2021-02-07T21:54:54",
        "Updated": "2021-02-07T21:54:54"
      },
      "Invoice": {
        "InvoiceDate": "2021-12-29T08:00:00",
        "PaymentReminderSentDate": null,
        "Number": 1007,
        "BillingInvoiceStatus": 1,
        "Subscription": null,
        "Amount": 0.00,
        "AmountOutstanding": 0.00,
        "InvoiceLineItems": null,
        "IsUserGenerated": true,
        "Uid": "OW461AQg",
        "Created": "2021-02-11T19:47:45",
        "Updated": "2021-02-11T19:47:45"
      },
      "Amount": 0.00,
      "IsElectronicTransaction": false,
      "Uid": "EWBR5bWr",
      "Created": "2021-02-11T19:47:45",
      "Updated": "2021-02-11T19:47:45"
    }
  ]
};
