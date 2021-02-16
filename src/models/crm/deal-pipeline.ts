import { DealPipelineStage } from './deal-pipeline-stage';

export interface DealPipeline {
  Name: string;
  DealPipelineStages?: DealPipelineStage[];
  Uid: string;
  Created: Date;
  Updated: Date;
}
