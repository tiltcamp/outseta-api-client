import { EmailListPerson } from "./email-list-person";

export interface EmailList {
  Name: string;
  WelcomeSubject?: string;
  WelcomeBody: string;
  WelcomeFromName?: string;
  WelcomeFromEmail?: string;
  EmailListPerson: EmailListPerson[];
  CountSubscriptionsActive: number;
  CountSubscriptionsBounce: number;
  CountSubscriptionsSpam: number;
  CountSubscriptionsUnsubscribed: number;
  Uid: string;
  Created: Date;
  Updated: Date;
}
