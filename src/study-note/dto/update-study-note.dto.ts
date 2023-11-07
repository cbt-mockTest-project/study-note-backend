import { PartialType, PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyNote } from '../entities/study-note.entity';
import { IsOptional } from 'class-validator';

export class UpdateStudyNoteInput extends PartialType(
  PartialType(PickType(StudyNote, ['name'])),
) {
  @IsOptional()
  folderId?: number = null;
}

export class UpdateStudyNoteOutput extends CoreOutput {}
