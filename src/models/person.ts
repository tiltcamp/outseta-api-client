export default interface Person {
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
