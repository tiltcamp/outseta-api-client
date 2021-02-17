import { ActivityType } from "./activity-type";
import { EntityType } from "../shared/entity-type";

export interface Activity {
  Title: string;
  Description: string;
  ActivityData?: string;
  ActivityDateTime: Date;
  ActivityType: ActivityType;
  EntityType: EntityType;
  EntityUid: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}
