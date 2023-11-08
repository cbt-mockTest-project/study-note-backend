import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateUserInput extends PickType(User, [
  'email',
  'nickname',
  'loginType',
  'picture',
]) {}

export class CreateUserOutput extends CoreOutput {
  @IsNumber()
  @IsOptional()
  id?: number;
}
