import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import People from '../../../../src/api/crm/people';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import PersonModel from '../../../../src/models/person';
import ValidationError from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Crm', () => {
    describe('People', () => {
      describe('add', () => {
        let server: Pretender;
        let store: Store;

        let people: People;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          people = new People(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Email: 'hello@tiltcamp.com'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/people', responseHandler);
          });

          const response = await people.add({
            Email: 'hello@tiltcamp.com'
          }) as PersonModel;

          expect(response.Email).toBe('hello@tiltcamp.com');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Email: ''
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/people', responseHandler);
          });

          const response = await people.add({
            Email: ''
          }) as ValidationError<PersonModel>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "The Email field is not a valid e-mail address.",
            PropertyName: "Email"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Email: 'hello@tiltcamp.com'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({})
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/people', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await people.add({
              Email: 'hello@tiltcamp.com'
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
  "PersonAccount": [],
  "DealPeople": [],
  "Account": null,
  "FullName": "hello@tiltcamp.com",
  "OAuthIntegrationStatus": 0,
  "UserAgentPlatformBrowser": "",
  "Uid": "rmkxpA1Q",
  "Created": "2021-01-24T23:03:35.2226324Z",
  "Updated": "2021-01-24T23:03:35.2226324Z"
};

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
        "Created": "2021-01-24T23:00:08.7233628Z",
        "Updated": "2021-01-24T23:00:08.7233628Z"
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
