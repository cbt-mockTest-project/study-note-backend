import { IsArray, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { FolderReadAccess } from '../entities/folder-read-access.entity';

export class GetFolderReadAccessesOutput extends CoreOutput {
  @IsArray()
  @IsOptional()
  folderReadAccesses?: FolderReadAccess[];
}
