import Pretender, { ResponseHandler } from 'pretender';
import { Activities } from '../../../../src/api/crm/activities';
import { ActivityType } from '../../../../src/models/crm/activity-type';
import { EntityType } from '../../../../src/models/crm/entity-type';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { Store } from '../../../../src/util/store';

describe('api', () => {
  describe('Crm', () => {
    describe('Activities', () => {
      describe('getAll', () => {
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
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleResponse)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/activities', responseHandler);
          });

          const response = await activities.getAll();
          expect(response.metadata.total).toBe(3);
          expect(response.items).toHaveSize(3);
          expect(response.items[0].Uid).toBe("XQYOGZeW");
          expect(response.items[0].Title).toBe('Account created');
          expect(response.items[0].Description).toBe('TiltCamp and Friends created');
        });

        it('handles request with pagination, filters, fields', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({
              offset: '10',
              limit: '20',
              fields: 'Uid',
              ActivityType: '102',
              EntityType: '2',
              EntityUid: 'DQ2DyknW'
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
            this.get('https://test-company.outseta.com/api/v1/activities', responseHandler);
          });

          const response = await activities.getAll({
            offset: 10,
            limit: 20,
            fields: 'Uid',
            ActivityType: ActivityType.AccountAddPerson,
            EntityType: EntityType.Person,
            EntityUid: 'DQ2DyknW'
          });
          expect(response.metadata.total).toBe(0);
          expect(response.items).toHaveSize(0);
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
            expect(request.queryParams).toEqual({ fields: Activities.DEFAULT_FIELDS });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({ "Message": "An error has occurred." })
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/activities', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await activities.getAll();
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
    "limit": 3,
    "offset": 0,
    "total": 3
  },
  "items": [
    {
      "Title": "Account created",
      "Description": "TiltCamp and Friends created",
      "ActivityData": null,
      "ActivityDateTime": "2021-02-13T05:08:22",
      "ActivityType": 100,
      "EntityType": 1,
      "EntityUid": "amRdzZ9J",
      "Uid": "XQYOGZeW",
      "Created": "2021-02-13T05:08:22",
      "Updated": "2021-02-13T05:08:22"
    },
    {
      "Title": "Account created",
      "Description": "TiltCamp created",
      "ActivityData": null,
      "ActivityDateTime": "2021-02-01T16:40:25",
      "ActivityType": 100,
      "EntityType": 1,
      "EntityUid": "wQX4LxQK",
      "Uid": "y9qbpxNW",
      "Created": "2021-02-01T16:40:25",
      "Updated": "2021-02-01T16:40:25"
    },
    {
      "Title": "Account created",
      "Description": "TiltCamp created",
      "ActivityData": null,
      "ActivityDateTime": "2021-02-06T21:59:17",
      "ActivityType": 100,
      "EntityType": 1,
      "EntityUid": "pWrK8Kmn",
      "Uid": "yW10A2P9",
      "Created": "2021-02-06T21:59:17",
      "Updated": "2021-02-06T21:59:17"
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
