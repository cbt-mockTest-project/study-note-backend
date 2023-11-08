import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class UpdateUserInput extends PartialType(
  PickType(User, ['nickname', 'picture', 'refreshToken']),
) {}

export class UpdateUserOutput extends CoreOutput {}
