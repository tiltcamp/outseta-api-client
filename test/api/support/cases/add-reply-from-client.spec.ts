import Pretender, { ResponseHandler } from 'pretender';
import { Cases } from '../../../../src/api/support/cases';
import { CaseHistory } from '../../../../src/models/support/case-history';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Store } from '../../../../src/util/store';

describe('api', () => {
  describe('Support', () => {
    describe('Cases', () => {
      describe('addReplyFromClient', () => {
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
            expect(JSON.parse(request.requestBody)).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post(
              'https://test-company.outseta.com/api/v1/support/cases/rmkyza9g/clientresponse/This%20is%20a%20message%20from%20a%20client',
              responseHandler
            );
          });

          const response = await cases.addReplyFromClient({
            Case: {
              Uid: 'rmkyza9g'
            },
            Comment: 'This is a message from a client'
          }) as CaseHistory;

          expect(response.Comment).toBe('This is a message from a client');
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({});
            expect(JSON.parse(request.requestBody)).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post(
              'https://test-company.outseta.com/api/v1/support/cases/rmkyza9g/clientresponse/This%20is%20a%20message%20from%20a%20client',
              responseHandler
            );
          });

          let exception;
          let response;

          try {
            response = await cases.addReplyFromClient({
              Case: {
                Uid: 'rmkyza9g'
              },
              Comment: 'This is a message from a client'
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
  "HistoryDateTime": "2021-02-16T16:33:26.8564311Z",
  "Case": {
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
  },
  "AgentName": null,
  "Comment": "This is a message from a client",
  "Type": 1,
  "SeenDateTime": null,
  "ClickDateTime": null,
  "PersonEmail": null,
  "NewUvi": null,
  "Uid": "B9lb8Em8",
  "Created": "2021-02-16T16:33:26.8564311Z",
  "Updated": "2021-02-16T16:33:26.8564311Z"
};

