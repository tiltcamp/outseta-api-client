import { Deal } from './deal';
import { Person } from "./person";

export interface DealPerson {
  Person?: Person;
  Deal?: Deal;
  Uid: string;
  Created: Date;
  Updated: Date;
}
