import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class UploadImageInput {
  @IsString()
  path: string;
}

export class UploadImageOutput extends CoreOutput {
  @IsString()
  @IsOptional()
  url?: string;
}
