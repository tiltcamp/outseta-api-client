import AddOn from "./add-on";

export default interface SubscriptionAddOn {
  BillingRenewalTerm: number;
  Subscription?: unknown;
  AddOn: AddOn;
  Quantity?: unknown;
  StartDate: Date;
  EndDate: Date;
  RenewalDate?: Date;
  NewRequiredQuantity?: unknown;
  Uid: string;
  Created: Date;
  Updated: Date;
}
