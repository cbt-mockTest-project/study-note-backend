import { IsNumber, IsOptional } from 'class-validator';

export class ResetCardScoreInput {
  @IsOptional()
  @IsNumber()
  studyCardId: number;
}
