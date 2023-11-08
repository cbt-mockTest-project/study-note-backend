import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsOptional } from 'class-validator';
import { StudyNote } from '../entities/study-note.entity';

export class GetStudyNoteOutput extends CoreOutput {
  @IsOptional()
  studyNote?: StudyNote;
}
