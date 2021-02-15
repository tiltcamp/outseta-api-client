import { AddOn } from './add-on';
import { Subscription } from './subscription';

export interface SubscriptionAddOn {
  BillingRenewalTerm: number;
  Subscription: Partial<Subscription>;
  AddOn: Partial<AddOn>;
  Quantity?: unknown;
  StartDate: Date;
  EndDate: Date;
  RenewalDate?: Date;
  NewRequiredQuantity?: unknown;
  Uid: string;
  Created: Date;
  Updated: Date;
}
