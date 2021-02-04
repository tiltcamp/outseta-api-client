import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import People from '../../../../src/api/crm/people';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import PersonModel from '../../../../src/models/shared/person';
import ValidationError from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Crm', () => {
    describe('People', () => {
      describe('update', () => {
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
              Uid: 'DQ2DyknW',
              Email: 'demo@tilt.camp'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          const response = await people.update({
            Uid: 'DQ2DyknW',
            Email: 'demo@tilt.camp'
          }) as PersonModel;

          expect(response.Email).toBe('demo@tilt.camp');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'DQ2DyknW',
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
            this.put('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          const response = await people.update({
            Uid: 'DQ2DyknW',
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
              Uid: 'DQ2DyknW',
              Email: 'demo@tiltcamp.com'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await people.update({
              Uid: 'DQ2DyknW',
              Email: 'demo@tiltcamp.com'
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
  "Email": "demo@tilt.camp",
  "FirstName": "Jane",
  "LastName": "Doe",
  "MailingAddress": {
    "AddressLine1": "152 Test Lane",
    "AddressLine2": "Apt L",
    "AddressLine3": null,
    "City": "San Diego",
    "State": "CA",
    "PostalCode": "91511",
    "Country": "United States of America",
    "Uid": "yW1Kj1QB",
    "Created": "2021-01-20T05:24:53",
    "Updated": "2021-01-24T19:05:56"
  },
  "PasswordMustChange": false,
  "PhoneMobile": "4084841547",
  "PhoneWork": "4122144785",
  "Title": "Engineer",
  "Timezone": null,
  "Language": null,
  "IPAddress": null,
  "Referer": null,
  "UserAgent": null,
  "LastLoginDateTime": null,
  "OAuthGoogleProfileId": null,
  "PersonAccount": [
    {
      "Person": null,
      "Account": null,
      "IsPrimary": true,
      "Uid": "496L7AmX",
      "Created": "2021-01-20T05:25:56",
      "Updated": "2021-01-20T05:25:56"
    }
  ],
  "DealPeople": [

  ],
  "Account": null,
  "FullName": "Jane Doe",
  "OAuthIntegrationStatus": 0,
  "UserAgentPlatformBrowser": "",
  "Uid": "DQ2DyknW",
  "Created": "2021-01-20T05:24:53",
  "Updated": "2021-01-24T23:19:09.6144638Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Email": "",
        "FirstName": "Jane",
        "LastName": "Doe",
        "MailingAddress": {
          "AddressLine1": "152 Test Lane",
          "AddressLine2": "Apt L",
          "AddressLine3": null,
          "City": "San Diego",
          "State": "CA",
          "PostalCode": "91511",
          "Country": "United States of America",
          "Uid": "yW1Kj1QB",
          "Created": "2021-01-20T05:24:53",
          "Updated": "2021-01-24T19:05:56"
        },
        "PasswordMustChange": false,
        "PhoneMobile": "4084841547",
        "PhoneWork": "4122144785",
        "Title": "Engineer",
        "Timezone": null,
        "Language": null,
        "IPAddress": null,
        "Referer": null,
        "UserAgent": null,
        "LastLoginDateTime": null,
        "OAuthGoogleProfileId": null,
        "PersonAccount": [
          {
            "Person": null,
            "Account": null,
            "IsPrimary": true,
            "Uid": "496L7AmX",
            "Created": "2021-01-20T05:25:56",
            "Updated": "2021-01-20T05:25:56"
          }
        ],
        "DealPeople": [

        ],
        "Account": null,
        "FullName": "Jane Doe",
        "OAuthIntegrationStatus": 0,
        "UserAgentPlatformBrowser": "",
        "Uid": "DQ2DyknW",
        "Created": "2021-01-20T05:24:53",
        "Updated": "2021-01-24T23:20:05.7792484Z"
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
