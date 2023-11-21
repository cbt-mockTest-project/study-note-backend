import { IsOptional, ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SelectedNotes, StudySetting } from '../entites/history.entity';
import { Type } from 'class-transformer';

export class SaveHistoryInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => SelectedNotes)
  selectedNotes?: SelectedNotes;

  @IsOptional()
  @ValidateNested()
  @Type(() => StudySetting)
  studySetting?: StudySetting;
}

export class SaveHistoryOutput extends CoreOutput {}
