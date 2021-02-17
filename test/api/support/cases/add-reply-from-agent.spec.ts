import Pretender, { ResponseHandler } from 'pretender';
import { Cases } from '../../../../src/api/support/cases';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Store } from '../../../../src/util/store';

describe('api', () => {
  describe('Support', () => {
    describe('Cases', () => {
      describe('addReplyFromAgent', () => {
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
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              AgentName: 'Firstname Lastname',
              Case: {
                Uid: 'rmkyza9g'
              },
              Comment: 'This is a response comment'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              ''
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/support/cases/rmkyza9g/replies', responseHandler);
          });

          const response = await cases.addReplyFromAgent({
            AgentName: 'Firstname Lastname',
            Case: {
              Uid: 'rmkyza9g'
            },
            Comment: 'This is a response comment'
          });

          expect(response).toBeNull();
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toEqual({
              AgentName: 'Firstname Lastname',
              Case: {
                Uid: 'rmkyza9g'
              },
              Comment: 'This is a response comment'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/support/cases/rmkyza9g/replies', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await cases.addReplyFromAgent({
              AgentName: 'Firstname Lastname',
              Case: {
                Uid: 'rmkyza9g'
              },
              Comment: 'This is a response comment'
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
