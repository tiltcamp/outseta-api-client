import { Person } from '../crm/person';
import { EmailList } from "./email-list";

export interface EmailListPerson {
  EmailList: EmailList;
  Person: Person;
  EmailListSubscriberStatus: number;
  SubscribedDate: Date;
  ConfirmedDate?: Date;
  UnsubscribedDate?: Date;
  CleanedDate?: Date;
  WelcomeEmailDeliverDateTime?: Date;
  WelcomeEmailOpenDateTime?: Date;
  UnsubscribeReason?: string;
  UnsubscribeReasonOther?: string;
  RecaptchaToken?: string;
  RecaptchaSiteKey?: string;
  SendWelcomeEmail: boolean;
  Source?: string;
  Uid: string;
  Created: Date;
  Updated: Date;
}
