import { EntityType } from '../shared/entity-type';
import { Invoice } from './invoice';

export interface InvoiceLineItem {
  StartDate?: Date;
  EndDate?: Date;
  Description: string;
  UnitOfMeasure: string;
  Quantity?: number;
  Rate: number;
  Amount: number;
  Tax: number;
  Invoice?: Invoice;
  LineItemType: EntityType;
  LineItemEntityUid?: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}
