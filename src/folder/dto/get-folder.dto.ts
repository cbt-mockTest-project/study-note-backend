import { CoreOutput } from 'src/common/dtos/output.dto';
import { Folder } from '../entities/folder.entity';
import { IsOptional } from 'class-validator';

export class GetFolderOutput extends CoreOutput {
  @IsOptional()
  folder?: Folder;
}
