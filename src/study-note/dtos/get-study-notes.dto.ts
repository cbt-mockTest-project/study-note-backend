import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsOptional } from 'class-validator';
import { StudyNote } from '../entities/study-note.entity';

export class GetStudyNotesInput {
  @IsOptional()
  folderId?: number;
}

export class GetStudyNotesOutput extends CoreOutput {
  @IsOptional()
  studyNotes?: StudyNote[] = [];
}
