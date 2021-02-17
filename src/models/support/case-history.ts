import { Case } from './case';

export interface CaseHistory {
  HistoryDateTime: Date;
  Case?: Case;
  AgentName: string;
  Comment: string;
  Type: number;
  SeenDateTime?: Date;
  ClickDateTime?: Date;
  PersonEmail?: unknown;
  NewUvi?: unknown;
  Uid: string;
  Created: Date;
  Updated: Date;
}
