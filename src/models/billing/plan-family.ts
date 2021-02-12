import { Plan } from './plan';

export interface PlanFamily {
  Name: string;
  IsActive: boolean;
  Plans?: Plan[];
  Uid: string;
  Created: Date;
  Updated: Date;
}
