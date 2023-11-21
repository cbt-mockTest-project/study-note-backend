import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudySetting } from '../entites/history.entity';
import { Type } from 'class-transformer';

export class SaveHistoryInput {
  @ValidateNested()
  @Type(() => StudySetting)
  studySetting: StudySetting;
}

export class SaveHistoryOutput extends CoreOutput {}
