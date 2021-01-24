import Request from '../../util/request';
import Store from '../../util/store';

export default class Profile {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Get the profile belonging to the provided user's access token.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   accessToken: jwt_user_token
   * });
   * const response = await client.user.profile.get();
   * console.log(response);
   * ```
   *
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async get(): Promise<ProfileResponse> {
    const request = new Request(this.store, 'profile').authenticateAsUser();
    const response = await request.get();

    if (!response.ok) throw response;
    return await response.json() as ProfileResponse;
  }

  /**
   * Update the profile belonging to the provided user's uid and access token.
   *
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   accessToken: jwt_user_token
   * });
   * const response = await client.user.profile.update({
   *   Uid: 'DQ2DyknW',
   *   FirstName: 'Jane',
   *   LastName: 'Doe'
   * });
   * console.log(response);
   * ```
   *
   * @param profile The profile fields and values to update. Must include the user's uid.
   * @returns The response body.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async update(profile: ProfileUpdate): Promise<ProfileResponse> {
    const request = new Request(this.store, 'profile')
      .authenticateAsUser()
      .withBody(profile);
    const response = await request.put();

    if (!response.ok) throw response;
    return await response.json() as ProfileResponse;
  }
}

export interface ProfileUpdate extends Partial<ProfileResponse> {
  [key: string]: unknown;
  Uid: string;
}

export interface ProfileResponse {
  Email: string;
  FirstName: string;
  LastName: string;
  MailingAddress: MailingAddress;
  PasswordMustChange: boolean;
  PhoneMobile: string;
  PhoneWork: string;
  Title?: string;
  Timezone?: unknown;
  Language?: unknown;
  IPAddress?: unknown;
  Referer?: unknown;
  UserAgent?: unknown;
  LastLoginDateTime?: unknown;
  OAuthGoogleProfileId?: unknown;
  PersonAccount: PersonAccount[];
  DealPeople: unknown[];
  Account?: unknown;
  FullName: string;
  OAuthIntegrationStatus: number;
  UserAgentPlatformBrowser: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}

export interface MailingAddress {
  AddressLine1?: string;
  AddressLine2?: string;
  AddressLine3?: string;
  City: string;
  State: string;
  PostalCode: string;
  Country?: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}

export interface PersonAccount {
  Person?: unknown;
  Account?: unknown;
  IsPrimary: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}
