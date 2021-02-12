import { Account } from "../crm/account";
import { BillingTransactionType } from "./billing-transaction-type";
import { Invoice } from "./invoice";

export interface Transaction {
  TransactionDate: Date;
  BillingTransactionType: BillingTransactionType;
  Account: Account;
  Invoice: Invoice;
  Amount: number;
  IsElectronicTransaction: boolean;
  Uid: string;
  Created: Date;
  Updated: Date;
}
