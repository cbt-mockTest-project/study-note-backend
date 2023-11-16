import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StudyNote } from '../entities/study-note.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { Type } from 'class-transformer';

class CardInfo extends PickType(StudyCard, [
  'question',
  'answer',
  'answer_img',
  'question_img',
]) {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  noteId: number;
}
export class SaveStudyNoteInput {
  @IsOptional()
  @IsNumber()
  noteId: number;

  @IsString()
  name: string;

  @IsNumber()
  folderId: number = null;

  @IsArray()
  @ValidateNested()
  @Type(() => CardInfo)
  studyCards: CardInfo[] = [];
}

export class SaveStudyNoteOutput extends CoreOutput {
  @IsOptional()
  studyNote?: StudyNote;
}
