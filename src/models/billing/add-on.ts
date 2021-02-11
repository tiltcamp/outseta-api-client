import PlanAddOn from './plan-add-on';

export default interface AddOn {
  Name: string;
  BillingAddOnType: number;
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
