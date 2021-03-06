import Pretender, { ResponseHandler } from 'pretender';

import { Store } from '../../../../src/util/store';
import { ServerCredentials, UserCredentials } from '../../../../src/util/credentials';
import { PlanFamilies } from '../../../../src/api/billing/plan-families';

describe('api', () => {
  describe('Billing', () => {
    describe('PlanFamilies', () => {
      describe('getAll', () => {
        let server: Pretender;
        let store: Store;

        let planFamilies: PlanFamilies;

        beforeEach(() => {
          if (server) server.shutdown();

          store = new Store(
            'https://test-company.outseta.com/api/v1/',
            new UserCredentials(),
            new ServerCredentials('example_key', 'example_secret')
          );

          planFamilies = new PlanFamilies(store);
        });

        afterAll(() => {
          server.shutdown();
        });

        it('handles successful request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBeUndefined();
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
            this.get('https://test-company.outseta.com/api/v1/billing/planfamilies', responseHandler);
          });

          const response = await planFamilies.getAll();
          expect(response.metadata.total).toBe(1);
          expect(response.items).toHaveSize(1);
          expect(response.items[0].Name).toBe('Main Plans');
        });

        it('handles request with pagination', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBeUndefined();
            expect(request.queryParams).toEqual({ offset: '10', limit: '20' });
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              200,
              {'Content-Type': 'application/json'},
              JSON.stringify(exampleNoResults)
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/planfamilies', responseHandler);
          });

          await planFamilies.getAll({ offset: 10, limit: 20 });
        });

        it('throws failed request', async () => {
          const responseHandler: ResponseHandler = (request) => {
            expect(request.requestHeaders['authorization']).toBeUndefined();
            expect(request.queryParams).toEqual({});
            expect(request.requestBody).toBeNull();
            expect(request.requestHeaders['content-type']).toBe('application/json');

            return [
              500,
              {'Content-Type': 'application/json'},
              JSON.stringify({"Message": "An error has occurred."})
            ];
          };
          server = new Pretender(function () {
            this.get('https://test-company.outseta.com/api/v1/billing/planfamilies', responseHandler);
          });

          let exception;
          let response;

          try {
            response = await planFamilies.getAll();
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
      "Name": "Main Plans",
      "IsActive": true,
      "Plans": [
        {
          "Name": "Basic",
          "Description": "<p>All the important stuff.</p>",
          "PlanFamily": null,
          "IsQuantityEditable": false,
          "MinimumQuantity": 0,
          "MonthlyRate": 49.99,
          "AnnualRate": 0.00,
          "SetupFee": 0.00,
          "IsTaxable": false,
          "IsActive": true,
          "TrialPeriodDays": 7,
          "UnitOfMeasure": "",
          "PlanAddOns": null,
          "ContentGroups": null,
          "NumberOfSubscriptions": 0,
          "Uid": "wZmNw7Q2",
          "Created": "2020-11-13T03:44:06",
          "Updated": "2021-01-19T04:09:42"
        },
        {
          "Name": "Pro",
          "Description": "<p>For the true professionals.</p>",
          "PlanFamily": null,
          "IsQuantityEditable": false,
          "MinimumQuantity": 0,
          "MonthlyRate": 149.99,
          "AnnualRate": 0.00,
          "SetupFee": 0.00,
          "IsTaxable": false,
          "IsActive": true,
          "TrialPeriodDays": 7,
          "UnitOfMeasure": "",
          "PlanAddOns": null,
          "ContentGroups": null,
          "NumberOfSubscriptions": 0,
          "Uid": "y7maaKmE",
          "Created": "2020-11-13T03:44:42",
          "Updated": "2021-01-19T04:00:23"
        },
        {
          "Name": "Business",
          "Description": "<p>When your team expands, so can we.</p>",
          "PlanFamily": null,
          "IsQuantityEditable": false,
          "MinimumQuantity": 0,
          "MonthlyRate": 299.99,
          "AnnualRate": 0.00,
          "SetupFee": 0.00,
          "IsTaxable": false,
          "IsActive": true,
          "TrialPeriodDays": 7,
          "UnitOfMeasure": "",
          "PlanAddOns": null,
          "ContentGroups": null,
          "NumberOfSubscriptions": 0,
          "Uid": "Z496J79X",
          "Created": "2020-11-13T03:45:02",
          "Updated": "2021-01-19T04:00:14"
        }
      ],
      "Uid": "Jy9gw09M",
      "Created": "2020-11-13T03:43:34",
      "Updated": "2020-11-13T03:46:18"
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
