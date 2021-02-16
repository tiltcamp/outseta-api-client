import { Account } from './account';
import { DealPerson } from './deal-person';
import { DealPipelineStage } from './deal-pipeline-stage';
import { Person } from './person';

export interface Deal {
  Name: string;
  Amount: number;
  DueDate: Date;
  AssignedToPersonClientIdentifier: string;
  Weight: number;
  DealPipelineStage?: DealPipelineStage;
  Account?: Partial<Account>
  DealPeople?: DealPerson[];
  Contacts: string;
  Owner?: Person;
  Uid: string;
  Created: Date;
  Updated: Date;
}
