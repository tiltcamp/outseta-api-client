import Pretender, { ResponseHandler } from 'pretender';
import { EmailListSubscriptions } from '../../../../src/api/marketing/email-list-subscriptions';
import { Person } from '../../../../src/models/crm/person';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Marketing', () => {
    describe('EmailListSubscriptions', () => {
      describe('add', () => {
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
            expect(request.queryParams).toEqual({ fields: EmailListSubscriptions.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              EmailList: {
                Uid: 'ngWKYnQp'
              },
              Person: {
                Uid: 'wQXrBxWK'
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
            this.post('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions', responseHandler);
          });

          const response = await emailListSubscriptions.add({
            EmailList: {
              Uid: 'ngWKYnQp'
            },
            Person: {
              Uid: 'wQXrBxWK'
            }
          });

          expect(response).toBeNull();
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: 'Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              EmailList: {
                Uid: 'ngWKYnQp'
              },
              Person: {
                Uid: 'wQXrBxWK'
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
            this.post('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions', responseHandler);
          });

          const response = await emailListSubscriptions.add({
            EmailList: {
              Uid: 'ngWKYnQp'
            },
            Person: {
              Uid: 'wQXrBxWK'
            }
          }, {
            fields: 'Uid'
          });

          expect(response).toBeNull();
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: EmailListSubscriptions.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              EmailList: {
                Uid: 'ngWKYnQp'
              },
              Person: {
                Email: ''
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
            this.post('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions', responseHandler);
          });

          const response = await emailListSubscriptions.add({
            EmailList: {
              Uid: 'ngWKYnQp'
            },
            Person: {
              Email: ''
            }
          }) as ValidationError<Person>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "The Email field is not a valid e-mail address.",
            PropertyName: "Email"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: EmailListSubscriptions.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              EmailList: {
                Uid: 'ngWKYnQp'
              },
              Person: {
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
            this.post('https://test-company.outseta.com/api/v1/email/lists/ngWKYnQp/subscriptions', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await emailListSubscriptions.add({
              EmailList: {
                Uid: 'ngWKYnQp'
              },
              Person: {
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

const exampleResponse = '';

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Email": "",
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
        "FullName": "",
        "OAuthIntegrationStatus": 0,
        "UserAgentPlatformBrowser": "",
        "Uid": null,
        "Created": "2021-02-16T01:15:44.5866552Z",
        "Updated": "2021-02-16T01:15:44.5866552Z"
      },
      "TypeName": "Person",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "The Email field is not a valid e-mail address.",
          "PropertyName": "Email"
        }
      ]
    }
  ]
};
