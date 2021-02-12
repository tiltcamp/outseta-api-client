import { Subscription } from './subscription';
import { InvoiceLineItem } from './invoice-line-item';

export interface Invoice {
  InvoiceDate: Date;
  PaymentReminderSentDate?: Date;
  Number: number;
  BillingInvoiceStatus: number;
  Subscription: Subscription;
  Amount: number;
  AmountOutstanding: number;
  InvoiceLineItems: InvoiceLineItem[];
  IsUserGenerated: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}
