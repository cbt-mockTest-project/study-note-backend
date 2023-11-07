import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsOptional } from 'class-validator';
import { StudyNote } from '../entities/study-note.entity';

export class CreateStudyNoteInput extends PickType(StudyNote, ['name']) {
  @IsOptional()
  folderId?: number = null;
}

export class CreateStudyNoteOutput extends CoreOutput {
  @IsOptional()
  studyNote?: StudyNote;
}
