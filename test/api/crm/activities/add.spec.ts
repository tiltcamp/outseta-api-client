import Pretender, { ResponseHandler } from 'pretender';
import { Activities } from '../../../../src/api/crm/activities';
import { Activity } from '../../../../src/models/crm/activity';
import { EntityType } from '../../../../src/models/shared/entity-type';
import { ValidationError } from '../../../../src/models/wrappers/validation-error';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Store } from '../../../../src/util/store';

describe('api', () => {
  describe('Crm', () => {
    describe('Activities', () => {
      describe('add', () => {
        let server: Pretender;
        let store: Store;

        let activities: Activities;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          activities = new Activities(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Activities.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              EntityType: 1,
              EntityUid: 'jW7GJVWq',
              Title: 'Example custom activity',
              Description: 'Added a new custom activity'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/activities/customactivity', responseHandler);
          });

          const response = await activities.add({
            EntityType: EntityType.Account,
            EntityUid: 'jW7GJVWq',
            Title: 'Example custom activity',
            Description: 'Added a new custom activity'
          }) as Activity;

          expect(response.Uid).toBe('ZmNMX8xW');
          expect(response.EntityType).toBe(EntityType.Account);
          expect(response.EntityUid).toBe('jW7GJVWq');
        });

        it('handles request with fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: 'Uid' });
            expect(JSON.parse(request.requestBody)).toEqual({
              EntityType: 1,
              EntityUid: 'jW7GJVWq',
              Title: 'Example custom activity',
              Description: 'Added a new custom activity'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/activities/customactivity', responseHandler);
          });

          const response = await activities.add({
            EntityType: EntityType.Account,
            EntityUid: 'jW7GJVWq',
            Title: 'Example custom activity',
            Description: 'Added a new custom activity'
          }, {
            fields: 'Uid'
          }) as Activity;

          expect(response.Uid).toBe('ZmNMX8xW');
          expect(response.EntityType).toBe(EntityType.Account);
          expect(response.EntityUid).toBe('jW7GJVWq');
        });

        it('handles validation errors', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Activities.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              EntityType: 1,
              EntityUid: 'jW7GJVWq',
              Title: '',
              Description: ''
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              400,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleValidationResponse)
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/activities/customactivity', responseHandler);
          });

          const response = await activities.add({
            EntityType: EntityType.Account,
            EntityUid: 'jW7GJVWq',
            Title: '',
            Description: ''
          }) as ValidationError<null>;

          expect(response.ErrorMessage).toBe('Title or description has to be provided.');
          expect(response.EntityValidationErrors).toHaveSize(0);
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Activities.DEFAULT_FIELDS });
            expect(JSON.parse(request.requestBody)).toEqual({
              EntityType: -1,
              EntityUid: 'malformed',
              Title: 'Example custom activity',
              Description: 'Added a new custom activity'
            });
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.post('https://test-company.outseta.com/api/v1/activities/customactivity', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await activities.add({
              EntityType: -1,
              EntityUid: 'malformed',
              Title: 'Example custom activity',
              Description: 'Added a new custom activity'
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
  "Title": "Example custom activity",
  "Description": "Added a new custom activity",
  "ActivityData": null,
  "ActivityDateTime": "2021-02-15T17:57:17.8070927Z",
  "ActivityType": 10,
  "EntityType": 1,
  "EntityUid": "jW7GJVWq",
  "Uid": "ZmNMX8xW",
  "Created": "2021-02-15T17:57:17.8070927Z",
  "Updated": "2021-02-15T17:57:17.8070927Z"
};

const exampleValidationResponse = {
  "ErrorMessage": "Title or description has to be provided.",
  "EntityValidationErrors": []
};
