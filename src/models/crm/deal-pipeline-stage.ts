import { Deal } from './deal';
import { DealPipeline } from './deal-pipeline';

export interface DealPipelineStage {
  Weight: number;
  Name: string;
  DealPipeline?: DealPipeline[];
  Deals?: Deal[];
  Uid: string;
  Created: Date;
  Updated: Date;
}
