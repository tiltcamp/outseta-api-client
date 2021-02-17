import { Person } from '../crm/person';
import { CaseHistory } from './case-history';
import { CaseSource } from './case-source';
import { CaseStatus } from './case-status';

export interface Case {
  SubmittedDateTime: Date;
  FromPerson?: Person;
  AssignedToPersonClientIdentifier: string;
  Subject: string;
  Body: string;
  UserAgent?: string;
  Status: CaseStatus;
  Source: CaseSource;
  CaseHistories?: CaseHistory[];
  IsOnline: boolean;
  LastCaseHistory?: CaseHistory;
  Participants?: string;
  RecaptchaToken?: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}
