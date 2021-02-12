import InvoiceDisplayItem from './invoice-display-item';

export default interface ChargeSummary {
  Number: number;
  InvoiceDate: Date;
  Subtotal: number;
  Tax: number;
  Paid: number;
  InvoiceDisplayItems: InvoiceDisplayItem[];
  Total: number;
  Balance: number;
}
