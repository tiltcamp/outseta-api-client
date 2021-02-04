import Address from './address';
import PersonAccount from './person-account';

export default interface Person {
  Email: string;
  FirstName?: string;
  LastName?: string;
  MailingAddress?: Address;
  PasswordMustChange?: boolean;
  PhoneMobile?: string;
  PhoneWork?: string;
  Title?: string;
  Timezone?: unknown;
  Language?: unknown;
  IPAddress?: unknown;
  Referer?: unknown;
  UserAgent?: unknown;
  LastLoginDateTime?: unknown;
  OAuthGoogleProfileId?: unknown;
  PersonAccount?: PersonAccount[];
  DealPeople?: unknown[];
  Account?: unknown;
  FullName?: string;
  OAuthIntegrationStatus?: number;
  UserAgentPlatformBrowser?: string;
  Uid?: string;
  Created?: Date;
  Updated?: Date;
}
