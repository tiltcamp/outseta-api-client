import { PlanAddOn } from './plan-add-on';
import { PlanFamily } from './plan-family';

export interface Plan {
  Name: string;
  Description: string;
  PlanFamily: PlanFamily;
  IsQuantityEditable: boolean;
  MinimumQuantity: number;
  MonthlyRate: number;
  AnnualRate: number;
  SetupFee: number;
  IsTaxable: boolean;
  IsActive: boolean;
  TrialPeriodDays: number;
  UnitOfMeasure: string;
  PlanAddOns: PlanAddOn[];
  NumberOfSubscriptions: number;
  Uid: string;
  Created: Date;
  Updated: Date;
}
