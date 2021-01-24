import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../../src/util/store';
import People from '../../../../src/api/crm/people';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Crm', () => {
    describe('People', () => {
      describe('getAll', () => {
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
            this.get('https://test-company.outseta.com/api/v1/crm/people', responseHandler);
          });

          const response = await people.getAll();
          expect(response.metadata.total).toBe(1);
          expect(response.items).toHaveSize(1);
          expect(response.items[0].Email).toBe('demo@tiltcamp.com');
        });

        it('handles request with pagination', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ offset: '10', limit: '20' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify({})
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/people', responseHandler);
          });

          await people.getAll({ offset: 10, limit: 20 });
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
              JSON.stringify({})
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/crm/people', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await people.getAll();
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
    }
  ]
};
