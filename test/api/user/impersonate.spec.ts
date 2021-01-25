import Pretender, { ResponseHandler } from 'pretender';
import Store from '../../../src/util/store';
import User from '../../../src/api/user';
import { ServerCredentials, UserCredentials } from '../../../src/util/credentials';

describe('api', () => {
  describe('User', () => {
    describe('impersonate', () => {
      let server: Pretender;
      let store: Store;

      let user: User;

      beforeEach(() => {
        if (server) server.shutdown();

        store = new Store(
          'https://test-company.outseta.com/api/v1/',
          new UserCredentials(),
          new ServerCredentials('example_key', 'example_secret')
        );

        user = new User(store);
      });

      afterAll(() => {
        server.shutdown();
      });

      it('handles successful request', async () => {
        const responseHandler: ResponseHandler = (request) => {
          expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({
            username: 'example_username',
            password: '',
            'grant_type': 'password',
            'client_id': 'outseta_auth_widget'
          });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify(exampleResponse)
          ];
        };
        server = new Pretender(function () {
          this.post('https://test-company.outseta.com/api/v1/tokens', responseHandler);
        });

        expect(store.userAuth.accessToken).toBeUndefined();

        const response = await user.impersonate('example_username');

        expect(store.userAuth.accessToken).toBe(exampleResponse.access_token);
        expect(response.access_token).toBe(exampleResponse.access_token);
        expect(response.expires_in).toBe(exampleResponse.expires_in);
        expect(response.token_type).toBe(exampleResponse.token_type);
      });

      it('throws failed request', async () => {
        const responseHandler: ResponseHandler = (request) => {
          expect(request.requestHeaders['authorization']).toBe('Outseta example_key:example_secret');
          expect(request.queryParams).toEqual({});
          expect(JSON.parse(request.requestBody)).toEqual({
            username: 'example_username',
            password: '',
            'grant_type': 'password',
            'client_id': 'outseta_auth_widget'
          });
          expect(request.requestHeaders['content-type']).toBe('application/json');

          return [
            500,
            {'Content-Type': 'application/json'},
            JSON.stringify({})
          ];
        };
        server = new Pretender(function () {
          this.post('https://test-company.outseta.com/api/v1/tokens', responseHandler);
        });

        let exception;
        let response;

        try {
          response = await user.impersonate('example_username');
        } catch (e) {
          exception = e;
        }

        expect(response).toBeUndefined();
        expect(exception.status).toBe(500);
      });
    });
  });
});

const exampleResponse = {
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpWcmlCLUhmLWF4N015TFZFQmVfUmcwR1JsayIsImtpZCI6ImpWcmlCLUhmLWF4N015TFZFQmVfUmcwR1JsayJ9.eyJuYmYiOjE2MTExNTg5MTgsImV4cCI6MTYxMTc2MzcxOCwiaXNzIjoiaHR0cDovL2Jvb3RzYWFzLm91dHNldGEuY29tIiwiY2xpZW50X2lkIjoiYm9vdHNhYXMub3V0c2V0YS5jb20ucmVzb3VyY2Utb3duZXIiLCJzY29wZSI6WyJvcGVuaWQiLCJvdXRzZXRhIiwicHJvZmlsZSJdLCJzdWIiOiJEUTJEeWtuVyIsImF1dGhfdGltZSI6MTYxMTE1ODkxOCwiaWRwIjoiaWRzcnYiLCJlbWFpbCI6ImRlbW9AYm9vdHNhYXMuY28iLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuYW1lIjoiICIsIm5hbWVpZCI6IkRRMkR5a25XIiwib3V0c2V0YTphY2NvdW50VWlkIjoiRTlMeTNQV3ciLCJvdXRzZXRhOmlzUHJpbWFyeSI6IjEiLCJhbXIiOlsicGFzc3dvcmQiXSwib3V0c2V0YTppc3MiOiIiLCJhdWQiOiJib290c2Fhcy5vdXRzZXRhLmNvbSJ9.bi5JOdFSh-nEfwdmaZSRUYb3_s2NYQWeDaBufvPRzm747YgnZgrQybfcg7d1AGfE0FDkVbO_4WXPd14BxILzGrGXjf9wYy1SSFFFdhIo4OtdTPAE76E9SeaW0HkvWNleXZ0XUp97vXLkU8IOeTHtRKvRdVq_i72v565LNFPdOKqU81mdYNo7FO1lz8wUb5grm2_AjLQW0ORLNbmZSxTURIjS8ZhgA07fTOjkvVcTAXI0b0hSIbasVpcJNNfTPinYT9xH-HlfsVCiVurPpTmc0fhllaQ3HvDcuqPmWjcGZbEWiPYyiFG07lwo0JMTpYvx7LB12jBlOZ8901qKYAEfOg",
  "expires_in": 604800,
  "token_type": "Bearer"
};
