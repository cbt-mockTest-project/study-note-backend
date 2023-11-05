import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CoreOutput {
  @IsString()
  @IsOptional()
  error?: string;

  @IsBoolean()
  ok: boolean;
}
