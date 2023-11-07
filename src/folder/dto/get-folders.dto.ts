import { CoreOutput } from 'src/common/dtos/output.dto';
import { Folder } from '../entities/folder.entity';
import { IsEnum, IsOptional } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class GetFoldersInput extends PickType(Folder, ['access']) {
  @IsOptional()
  @IsEnum(['me', 'bookmark'])
  filter?: 'me' | 'bookmark' = 'me';
}

export class GetFoldersOutput extends CoreOutput {
  @IsOptional()
  folders?: Folder[] = [];
}
