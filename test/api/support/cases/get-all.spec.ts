import Pretender, { ResponseHandler } from 'pretender';
import { Cases } from '../../../../src/api/support/cases';
import { Store } from '../../../../src/util/store';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Support', () => {
    describe('Cases', () => {
      describe('getAll', () => {
        let server: Pretender;
        let store: Store;

        let cases: Cases;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          cases = new Cases(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Cases.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          const response = await cases.getAll();
          expect(response.metadata.total).toBe(1);
          expect(response.items).toHaveSize(1);
          expect(response.items[0].Uid).toBe('rmkyza9g');
          expect(response.items[0].Subject).toBe('Test Case 1');
        });

        it('handles request with pagination, filters, fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              offset: '10',
              limit: '20',
              fields: 'Uid',
              'FromPerson.Email': 'hello@tiltcamp.com'
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
            this.get('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          const response = await cases.getAll({
            offset: 10,
            limit: 20,
            fields: 'Uid',
            FromPerson: {
              Email: 'hello@tiltcamp.com'
            }
          });
          expect(response.metadata.total).toBe(0);
          expect(response.items).toHaveSize(0);
        });

        it('handles request with FromPerson.Uid filter', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              fields: Cases.DEFAULT_FIELDS,
              'FromPerson.Uid': 'DQ2DyknW'
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
            this.get('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          const response = await cases.getAll({
            FromPerson: {
              Uid: 'DQ2DyknW',
              Email: 'hello@tiltcamp.com'
            }
          });
          expect(response.metadata.total).toBe(0);
          expect(response.items).toHaveSize(0);
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Cases.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await cases.getAll();
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
      "SubmittedDateTime": "2021-02-16T04:50:22",
      "FromPerson": null,
      "AssignedToPersonClientIdentifier": "Rm8rb7y9",
      "Subject": "Test Case 1",
      "Body": "<p>This is an example case</p>",
      "UserAgent": null,
      "Status": 1,
      "Source": 1,
      "CaseHistories": null,
      "IsOnline": false,
      "LastCaseHistory": null,
      "Participants": null,
      "RecaptchaToken": null,
      "Uid": "rmkyza9g",
      "Created": "2021-02-16T04:50:22",
      "Updated": "2021-02-16T04:50:22"
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
