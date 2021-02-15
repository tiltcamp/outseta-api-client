import { Account } from '../crm/account';
import { Plan } from './plan';
import { BillingRenewalTerm } from './billing-renewal-term';
import { SubscriptionAddOn } from './subscription-add-on';

export interface Subscription {
  Uid?: string;
  Plan: Plan;
  BillingRenewalTerm: BillingRenewalTerm;
  Account: Partial<Account>;
  SubscriptionAddOns?: SubscriptionAddOn[];
  Quantity?: unknown;
  StartDate?: Date;
  EndDate?: Date;
  RenewalDate?: Date;
  NewRequiredQuantity?: unknown;
  IsPlanUpgradeRequired?: boolean;
  PlanUpgradeRequiredMessage?: string;
  DiscountCouponSubscriptions?: unknown[];
  Created?: Date;
  Updated?: Date;
}
