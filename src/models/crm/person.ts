import { Address } from '../shared/address';
import { Account } from './account';
import { DealPerson } from './deal-person';
import { PersonAccount } from './person-account';

export interface Person {
  Email: string;
  FirstName?: string;
  LastName?: string;
  ProfileImageS3Url?: string;
  MailingAddress?: Address;
  PasswordMustChange?: boolean;
  PhoneMobile?: string;
  PhoneWork?: string;
  Title?: string;
  Timezone?: unknown;
  Language?: string;
  IPAddress?: string;
  Referer?: string;
  UserAgent?: string;
  LastLoginDateTime?: Date;
  OAuthGoogleProfileId?: unknown;
  PersonAccount?: PersonAccount[];
  DealPeople?: DealPerson[];
  Account?: Account;
  FullName?: string;
  OAuthIntegrationStatus?: number;
  UserAgentPlatformBrowser?: string;
  Uid?: string;
  Created?: Date;
  Updated?: Date;
}
