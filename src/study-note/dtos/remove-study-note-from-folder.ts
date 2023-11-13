import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class RemoveStudyNoteFromFolderInput {
  @IsNumber()
  studyNoteId: number;
  @IsNumber()
  folderId: number;
}

export class RemoveStudyNoteFromFolderOutput extends CoreOutput {}
