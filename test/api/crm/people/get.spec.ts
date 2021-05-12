import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { People } from '../../../../src/api/crm/people';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Crm', () => {
    describe('People', () => {
      describe('get', () => {
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
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          const response = await people.get('DQ2DyknW');
          expect(response.Email).toBe('demo@tiltcamp.com');
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
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await people.get('DQ2DyknW');
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
  "ProfileImageS3Url": "https://s3.amazonaws.com/outseta-production/0000/user-image.jpg",
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
  "Updated": "2021-01-24T19:16:37"
};
