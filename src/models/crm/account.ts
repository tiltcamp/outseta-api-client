import { Address } from '../shared/address';
import { PersonAccount } from './person-account';
import { AccountStage } from './account-stage';
import { Subscription } from '../billing/subscription';

export interface Account {
  Name: string;
  ClientIdentifier?: unknown;
  IsDemo: boolean;
  BillingAddress: Address;
  MailingAddress: Address;
  AccountStage: AccountStage;
  PaymentInformation?: unknown;
  PersonAccount: PersonAccount[];
  Subscriptions: Subscription[];
  Deals: unknown[];
  LastLoginDateTime?: unknown;
  AccountSpecificPageUrl1: string;
  AccountSpecificPageUrl2: string;
  AccountSpecificPageUrl3: string;
  AccountSpecificPageUrl4: string;
  AccountSpecificPageUrl5: string;
  RewardFulReferralId?: unknown;
  HasLoggedIn: boolean;
  AccountStageLabel: string;
  DomainName?: unknown;
  LatestSubscription?: unknown;
  CurrentSubscription?: unknown;
  PrimaryContact?: unknown;
  PrimarySubscription?: unknown;
  RecaptchaToken?: unknown;
  LifetimeRevenue: number;
  Uid: string;
  Created: Date;
  Updated: Date;
}
