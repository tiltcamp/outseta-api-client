import Pretender, { ResponseHandler } from 'pretender';

import Store from '../../../../src/util/store';
import Profile from '../../../../src/api/user/profile';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

import PersonModel from '../../../../src/models/person';
import ValidationError from '../../../../src/models/validation-error';

describe('api', () => {
  describe('User', () => {
    describe('Profile', () => {
      describe('update', () => {
        let server: Pretender;
        let store: Store;

        let profile: Profile;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials('example_token'),
            new ServerCredentials()
          );

          profile = new Profile(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('bearer example_token');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'DQ2DyknW',
              FirstName: 'Jane',
              LastName: 'Doe'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/profile', responseHandler);
          });

          const response = await profile.update({
            Uid: 'DQ2DyknW',
            FirstName: 'Jane',
            LastName: 'Doe'
          }) as PersonModel;

          expect(response.FirstName).toBe('Jane');
          expect(response.LastName).toBe('Doe');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('bearer example_token');
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
            this.put('https://test-company.outseta.com/api/v1/profile', responseHandler);
          });

          const response = await profile.update({
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
            expect(request.requestHeaders['authorization']).toBe('bearer example_token');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              Uid: 'DQ2DyknW',
              FirstName: 'Jane',
              LastName: 'Doe'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({})
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/profile', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await profile.update({
              Uid: 'DQ2DyknW',
              FirstName: 'Jane',
              LastName: 'Doe'
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
  "Email": "demo@tiltcamp.com",
  "FirstName": "Jane",
  "LastName": "Doe",
  "MailingAddress": {
    "AddressLine1": '152 Test Lane',
    "AddressLine2": 'Apt L',
    "AddressLine3": null, 
    "City": "San Diego",
    "State": "CA",
    "PostalCode": "91511",
    "Country": "United States of America",
    "Uid": "yW1Kj1QB",
    "Created": "2021-01-20T05:24:53",
    "Updated": "2021-01-20T05:24:53"
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
  "PersonAccount":  [
    {
      "Person": null,
      "Account": null,
      "IsPrimary": true,
      "Uid": "496L7AmX",
      "Created": "2021-01-20T05:25:56",
      "Updated": "2021-01-20T05:25:56"
    }
  ],
  "DealPeople": [],
  "Account": null,
  "FullName": "Jane Doe",
  "OAuthIntegrationStatus": 0,
  "UserAgentPlatformBrowser": "",
  "Uid": "DQ2DyknW",
  "Created": "2021-01-20T05:24:53",
  "Updated": "2021-01-24T00:59:57.1856278Z"
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
        "Updated": "2021-01-24T19:37:53.9021072Z"
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
