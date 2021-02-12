import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { Password } from '../../../../src/api/user/password';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('User', () => {
    describe('Password', () => {
      describe('update', () => {
        let server: Pretender;
        let store: Store;

        let password: Password;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials('example_token'),
            new ServerCredentials()
          );

          password = new Password(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('bearer example_token');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              ExistingPassword: 'testpass',
              NewPassword: 'testpass2'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              ''
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/profile/password', responseHandler);
          });

          const response = await password.update('testpass', 'testpass2');
          expect(response).toBeNull();
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('bearer example_token');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              ExistingPassword: 'testpasss',
              NewPassword: 'testpass2'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/profile/password', responseHandler);
          });

          const response = await password.update('testpasss', 'testpass2');
          expect(response?.EntityValidationErrors[0].ValidationErrors).toHaveSize(1);
          expect(response?.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "currentPasswordMismatch",
            ErrorMessage: "The current password does not match",
            PropertyName: "Password"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('bearer example_token');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              ExistingPassword: 'testpass',
              NewPassword: 'testpass2'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.put('https://test-company.outseta.com/api/v1/profile/password', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await password.update('testpass', 'testpass2');
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

const exampleValidationResponse = {
  "ErrorMessage": "A validation error has occurred",
  "EntityValidationErrors": [
    {
      "Entity": {
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
          "Updated": "2021-01-24T01:20:53"
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
        "DealPeople": [],
        "Account": null,
        "FullName": "Jane Doe",
        "OAuthIntegrationStatus": 0,
        "UserAgentPlatformBrowser": "",
        "Uid": "DQ2DyknW",
        "Created": "2021-01-20T05:24:53",
        "Updated": "2021-01-24T01:21:03"
      },
      "TypeName": "Person",
      "ValidationErrors": [
        {
          "ErrorCode": "currentPasswordMismatch",
          "ErrorMessage": "The current password does not match",
          "PropertyName": "Password"
        }
      ]
    }
  ]
};
