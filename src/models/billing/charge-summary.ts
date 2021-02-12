import { InvoiceDisplayItem } from './invoice-display-item';

export interface ChargeSummary {
  Number: number;
  InvoiceDate: Date;
  Subtotal: number;
  Tax: number;
  Paid: number;
  InvoiceDisplayItems: InvoiceDisplayItem[];
  Total: number;
  Balance: number;
}
