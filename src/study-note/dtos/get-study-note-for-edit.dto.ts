import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyNote } from '../entities/study-note.entity';

export class GetStudyNoteForEditOutput extends CoreOutput {
  @IsOptional()
  studyNote?: StudyNote;
}
