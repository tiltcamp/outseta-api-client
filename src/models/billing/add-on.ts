import { BillingAddOnType } from './billing-add-on-type';
import { PlanAddOn } from './plan-add-on';

export interface AddOn {
  Name: string;
  BillingAddOnType: BillingAddOnType;
  IsQuantityEditable: boolean;
  MinimumQuantity: number;
  MonthlyRate: number;
  AnnualRate: number;
  SetupFee: number;
  UnitOfMeasure: string;
  IsTaxable: boolean;
  IsBilledDuringTrial: boolean;
  PlanAddOns?: PlanAddOn[];
  Uid: string;
  Created: Date;
  Updated: Date;
}
