import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class RefreshAuthTokenInput {
  @IsString()
  refreshToken: string;
}

export class RefreshAuthTokenOutput extends CoreOutput {
  @IsOptional()
  user?: User;

  @IsOptional()
  @IsString()
  accessToken?: string;
}
