import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsOptional } from 'class-validator';

export class FindUserOutput extends CoreOutput {
  @IsOptional()
  user?: User;
}
