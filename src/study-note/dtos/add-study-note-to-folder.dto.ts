import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class AddStudyNoteToFolderInput {
  @IsNumber()
  studyNoteId: number;
  @IsNumber()
  folderId: number;
}

export class AddStudyNoteToFolderOutput extends CoreOutput {}
