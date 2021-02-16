import Pretender, { ResponseHandler } from 'pretender';
import { EmailListSubscriptions } from '../../../../src/api/marketing/email-list-subscriptions';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Marketing', () => {
    describe('EmailListSubscriptions', () => {
      describe('getAll', () => {
        let server: Pretender;
        let store: Store;

        let emailListSubscriptions: EmailListSubscriptions;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          emailListSubscriptions = new EmailListSubscriptions(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              fields: EmailListSubscriptions.DEFAULT_FIELDS,
              orderBy: 'SubscribedDate'
            });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions', responseHandler);
          });

          const response = await emailListSubscriptions.getAll('ngWKYnQp');
          expect(response.metadata.total).toBe(1);
          expect(response.items).toHaveSize(1);
          expect(response.items[0].Uid).toBe('wQXrBxWK');
        });

        it('handles request with pagination, filters, fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              offset: '10',
              limit: '20',
              fields: 'Uid',
              orderBy: 'SubscribedDate'
            });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleNoResults)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/email/lists/alWKXnQp/subscriptions', responseHandler);
          });

          const response = await emailListSubscriptions.getAll('alWKXnQp', {
            offset: 10,
            limit: 20,
            fields: 'Uid'
          });
          expect(response.metadata.total).toBe(0);
          expect(response.items).toHaveSize(0);
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              fields: EmailListSubscriptions.DEFAULT_FIELDS,
              orderBy: 'SubscribedDate'
            });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/email/lists/malformed/subscriptions', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await emailListSubscriptions.getAll('malformed');
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
    "total": 1
  },
  "items": [
    {
      "EmailList": {
        "Name": "Test Email List 1",
        "WelcomeSubject": null,
        "WelcomeBody": "Welcome",
        "WelcomeFromName": null,
        "WelcomeFromEmail": null,
        "EmailListPerson": null,
        "CountSubscriptionsActive": 0,
        "CountSubscriptionsBounce": 0,
        "CountSubscriptionsSpam": 0,
        "CountSubscriptionsUnsubscribed": 0,
        "Uid": "ngWKYnQp",
        "Created": "2021-02-16T00:51:31",
        "Updated": "2021-02-16T00:51:31"
      },
      "Person": {
        "Email": "hello@tiltcamp.com",
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
        "PersonAccount": null,
        "DealPeople": null,
        "Account": null,
        "FullName": "hello@tiltcamp.com",
        "OAuthIntegrationStatus": 0,
        "UserAgentPlatformBrowser": "",
        "Uid": "dQGn2ozm",
        "Created": "2021-02-16T02:14:37",
        "Updated": "2021-02-16T02:14:37"
      },
      "EmailListSubscriberStatus": 1,
      "SubscribedDate": "2021-02-16T02:15:10",
      "ConfirmedDate": null,
      "UnsubscribedDate": null,
      "CleanedDate": null,
      "WelcomeEmailDeliverDateTime": null,
      "WelcomeEmailOpenDateTime": null,
      "UnsubscribeReason": null,
      "UnsubscribeReasonOther": null,
      "RecaptchaToken": null,
      "RecaptchaSiteKey": null,
      "SendWelcomeEmail": false,
      "Source": null,
      "Uid": "wQXrBxWK",
      "Created": "2021-02-16T02:15:10",
      "Updated": "2021-02-16T02:15:10"
    }
  ]
};

const exampleNoResults = {
  "metadata": {
    "limit": 100,
    "offset": 0,
    "total": 0
  },
  "items": []
};
