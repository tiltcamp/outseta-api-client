import Pretender, { ResponseHandler } from 'pretender';
import { Cases } from '../../../../src/api/support/cases';
import { Case } from '../../../../src/models/support/case';
import { CaseSource } from '../../../../src/models/support/case-source';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Store } from '../../../../src/util/store';

describe('api', () => {
  describe('Support', () => {
    describe('Cases', () => {
      describe('add', () => {
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
            expect(JSON.parse(request.requestBody)).toEqual({
              Subject: 'Test Case 1',
              Body: 'This is the initial message that opened the case',
              FromPerson: {
                Uid: 'dQGn2ozm'
              },
              Source: CaseSource.Website
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          const response = await cases.add({
            Subject: 'Test Case 1',
            Body: 'This is the initial message that opened the case',
            FromPerson: {
              Uid: 'dQGn2ozm'
            },
            Source: CaseSource.Website
          }) as Case;

          expect(response.Subject).toBe('Test Case 1');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              fields: 'Uid',
              sendAutoResponder: 'true'
            });
            expect(JSON.parse(request.requestBody)).toEqual({
              Subject: 'Test Case 1',
              Body: 'This is the initial message that opened the case',
              FromPerson: {
                Uid: 'dQGn2ozm'
              },
              Source: CaseSource.Website
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          const response = await cases.add({
            Subject: 'Test Case 1',
            Body: 'This is the initial message that opened the case',
            FromPerson: {
              Uid: 'dQGn2ozm'
            },
            Source: CaseSource.Website
          }, {
            fields: 'Uid',
            sendAutoResponder: true
          }) as Case;

          expect(response.Subject).toBe('Test Case 1');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Cases.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Subject: 'Test Case 1',
              Body: 'This is the initial message that opened the case',
              FromPerson: {
                Uid: 'dQGn2ozm'
              },
              Source: -1
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          const response = await cases.add({
            Subject: 'Test Case 1',
            Body: 'This is the initial message that opened the case',
            FromPerson: {
              Uid: 'dQGn2ozm'
            },
            Source: -1
          }) as ValidationError<Case>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "outsetaError",
            ErrorMessage: "The field Source must be between 1 and 5.",
            PropertyName: "Source"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Cases.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Subject: 'Test Case 1',
              Body: 'This is the initial message that opened the case',
              FromPerson: {
                Uid: 'malformed'
              },
              Source: CaseSource.Website
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/support/cases', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await cases.add({
              Subject: 'Test Case 1',
              Body: 'This is the initial message that opened the case',
              FromPerson: {
                Uid: 'malformed'
              },
              Source: CaseSource.Website
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
  "SubmittedDateTime": "2021-02-16T16:48:44.1259668Z",
  "FromPerson": null,
  "AssignedToPersonClientIdentifier": null,
  "Subject": "Test Case 1",
  "Body": "This is the initial message that opened the case",
  "UserAgent": null,
  "Status": 1,
  "Source": 1,
  "CaseHistories": null,
  "IsOnline": false,
  "LastCaseHistory": null,
  "Participants": null,
  "RecaptchaToken": null,
  "Uid": "L9nE6VQZ",
  "Created": "2021-02-16T16:48:44.1259668Z",
  "Updated": "2021-02-16T16:48:44.1259668Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "SubmittedDateTime": "2021-02-16T22:27:50.1617373Z",
        "FromPerson": {
          "DealPeople": [],
          "MailingAddress": {
            "AddressLine1": null,
            "AddressLine2": null,
            "AddressLine3": null,
            "City": "",
            "State": "",
            "PostalCode": "",
            "Country": null,
            "Uid": "rmkELL9g",
            "Created": "2021-02-16T02:14:37",
            "Updated": "2021-02-16T02:14:37"
          },
          "PersonAccount": [],
          "Email": "hello@tiltcamp.com",
          "FirstName": "",
          "LastName": "",
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
          "Account": null,
          "FullName": "hello@tiltcamp.com",
          "OAuthIntegrationStatus": 0,
          "UserAgentPlatformBrowser": "",
          "Uid": "dQGn2ozm",
          "Created": "2021-02-16T02:14:37",
          "Updated": "2021-02-16T02:14:37"
        },
        "AssignedToPersonClientIdentifier": null,
        "Subject": "Test Case 1",
        "Body": "This is the initial message that opened the case",
        "UserAgent": null,
        "Status": 1,
        "Source": -1,
        "CaseHistories": null,
        "IsOnline": false,
        "LastCaseHistory": null,
        "Participants": null,
        "RecaptchaToken": null,
        "Uid": null,
        "Created": "2021-02-16T22:27:50.1617373Z",
        "Updated": "2021-02-16T22:27:50.1617373Z"
      },
      "TypeName": "Case",
      "ValidationErrors": [
        {
          "ErrorCode": "outsetaError",
          "ErrorMessage": "The field Source must be between 1 and 5.",
          "PropertyName": "Source"
        }
      ]
    }
  ]
};
