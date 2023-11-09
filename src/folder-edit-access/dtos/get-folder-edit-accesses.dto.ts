import { IsArray, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { FolderEditAccess } from '../entities/folder-edit-access.entity';

export class GetFolderEditAccessesOutput extends CoreOutput {
  @IsArray()
  @IsOptional()
  folderEditAccesses?: FolderEditAccess[];
}
