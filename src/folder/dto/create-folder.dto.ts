import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Folder } from '../entities/folder.entity';
import { IsOptional } from 'class-validator';

export class CreateFolderInput extends PickType(Folder, ['name']) {}

export class CreateFolderOutput extends CoreOutput {
  @IsOptional()
  folder?: Folder;
}
