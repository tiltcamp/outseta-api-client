import { Invoice } from "./invoice";
import { SubscriptionAddOn } from "./subscription-add-on";

export interface UsageItem {
  UsageDate: Date;
  Invoice?: Invoice;
  SubscriptionAddOn: SubscriptionAddOn;
  Amount: number;
  Uid: string;
  Created: Date;
  Updated: Date;
}
