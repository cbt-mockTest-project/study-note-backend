import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { StudyCard } from '../entities/study-card.entity';

export class CreateStudyCardInput extends PickType(StudyCard, [
  'question',
  'answer',
  'question_img',
  'answer_img',
]) {
  @IsNumber()
  studyNoteId: number;
}

export class CreateStudyCardOutput extends CoreOutput {
  @IsOptional()
  studyCard?: StudyCard;
}
