import Invoice from "./invoice";

export default interface InvoiceLineItem {
  StartDate?: Date;
  EndDate?: Date;
  Description: string;
  UnitOfMeasure: string;
  Quantity?: number;
  Rate: number;
  Amount: number;
  Tax: number;
  Invoice?: Invoice;
  LineItemType: number;
  LineItemEntityUid?: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}
