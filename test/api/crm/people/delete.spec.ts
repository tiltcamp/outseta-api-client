import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { People } from '../../../../src/api/crm/people';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';

describe('api', () => {
  describe('Crm', () => {
    describe('People', () => {
      describe('delete', () => {
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
            this.delete('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          const response = await people.delete('DQ2DyknW');
          expect(response).toBeNull();
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              405,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleErrorResponse)
            ];
          };
          server = new Pretender(function () {
            this.delete('https://test-company.outseta.com/api/v1/crm/people/DQ2DyknW', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await people.delete('DQ2DyknW');
          } catch (e) {
            exception = e;
          }

          expect(response).toBeUndefined();
          expect(exception.status).toBe(405);
        });
      });
    });
  });
});

const exampleResponse = '';

const exampleErrorResponse = {
  "ErrorMessage": "Could not convert hash rmkxpB1Q to long",
  "EntityValidationErrors": []
};
