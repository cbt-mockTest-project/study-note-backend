import { PartialType, PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Folder } from '../entities/folder.entity';

export class UpdateFolderInput extends PartialType(
  PickType(Folder, ['access', 'name', 'description']),
) {}

export class UpdateFolderOutput extends CoreOutput {}
