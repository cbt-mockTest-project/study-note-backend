import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';
import { IsOptional } from 'class-validator';

export class MeOutput extends CoreOutput {
  @IsOptional()
  user?: User;
}
