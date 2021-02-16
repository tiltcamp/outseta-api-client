import Pretender, { ResponseHandler } from 'pretender';
import { Store } from '../../../../src/util/store';
import { Deals } from '../../../../src/api/crm/deals';

import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Deal } from '../../../../src/models/crm/deal';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';

describe('api', () => {
  describe('Crm', () => {
    describe('Deals', () => {
      describe('add', () => {
        let server: Pretender;
        let store: Store;

        let deals: Deals;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          deals = new Deals(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: 'Completely New Deal',
              DealPipelineStage: {
                Uid: 'qNmdZA90'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/deals', responseHandler);
          });

          const response = await deals.add({
            Name: 'Completely New Deal',
            DealPipelineStage: {
              Uid: 'qNmdZA90'
            }
          }) as Deal;

          expect(response.Name).toBe('Completely New Deal');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: 'Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: 'Completely New Deal',
              DealPipelineStage: {
                Uid: 'qNmdZA90'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/deals', responseHandler);
          });

          const response = await deals.add({
            Name: 'Completely New Deal',
            DealPipelineStage: {
              Uid: 'qNmdZA90'
            }
          }, {
            fields: 'Uid'
          }) as Deal;

          expect(response.Name).toBe('Completely New Deal');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: '',
              DealPipelineStage: {
                Uid: 'qNmdZA90'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/deals', responseHandler);
          });

          const response = await deals.add({
            Name: '',
            DealPipelineStage: {
              Uid: 'qNmdZA90'
            }
          }) as ValidationError<Deal>;

          expect(response.EntityValidationErrors[0].ValidationErrors[0]).toEqual({
            ErrorCode: "required",
            ErrorMessage: "The Name field is required.",
            PropertyName: "Name"
          });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Deals.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              Name: '',
              DealPipelineStage: {
                Uid: 'malformed request'
              }
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/crm/deals', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await deals.add({
              Name: '',
              DealPipelineStage: {
                Uid: 'malformed request'
              }
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
  "Name": "Completely New Deal",
  "Amount": null,
  "DueDate": null,
  "AssignedToPersonClientIdentifier": null,
  "Weight": 0,
  "DealPipelineStage": null,
  "Account": null,
  "DealPeople": null,
  "Contacts": "",
  "Owner": null,
  "Uid": "wmjvOlmV",
  "Created": "2021-02-15T23:22:51.7320305Z",
  "Updated": "2021-02-15T23:22:51.7320305Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.",
  "EntityValidationErrors": [
    {
      "Entity": {
        "Name": "",
        "Amount": null,
        "DueDate": null,
        "AssignedToPersonClientIdentifier": null,
        "Weight": 0,
        "DealPipelineStage": {
          "DealPipeline": {
            "DealPipelineStages": [
              {
                "Deals": [],
                "Weight": 1,
                "Name": "Test Stage 1",
                "Uid": "krQVEem6",
                "Created": "2021-02-15T20:57:18",
                "Updated": "2021-02-15T20:57:18"
              }
            ],
            "Name": "Test Pipeline 1",
            "Uid": "Jy9gvRQM",
            "Created": "2021-02-15T20:57:18",
            "Updated": "2021-02-15T20:57:18"
          },
          "Deals": null,
          "Weight": 2,
          "Name": "Test Stage 2",
          "Uid": "qNmdZA90",
          "Created": "2021-02-15T20:57:18",
          "Updated": "2021-02-15T20:57:18"
        },
        "Account": null,
        "DealPeople": [],
        "Contacts": "",
        "Owner": null,
        "Uid": null,
        "Created": "2021-02-15T23:27:42.4521672Z",
        "Updated": "2021-02-15T23:27:42.4521672Z"
      },
      "TypeName": "Deal",
      "ValidationErrors": [
        {
          "ErrorCode": "required",
          "ErrorMessage": "The Name field is required.",
          "PropertyName": "Name"
        }
      ]
    }
  ]
};
