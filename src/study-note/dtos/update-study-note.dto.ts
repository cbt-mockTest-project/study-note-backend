import { PartialType, PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyNote } from '../entities/study-note.entity';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateStudyNoteInput extends PartialType(
  PartialType(PickType(StudyNote, ['name'])),
) {
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  studyCardOrder?: number[];
}

export class UpdateStudyNoteOutput extends CoreOutput {}
