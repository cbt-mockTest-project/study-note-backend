import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum LoginType {
  GOOGLE = 'google',
  KAKAO = 'kakao',
}

@Entity()
export class User extends CoreEntity {
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column({ unique: true })
  nickname: string;

  @IsEnum(LoginType)
  @Column({ type: 'enum', enum: LoginType })
  loginType: LoginType;

  @IsOptional()
  @IsString()
  @Column({ default: '' })
  picture?: string;

  @IsOptional()
  @IsString()
  @Column({ default: '', select: false })
  refreshToken?: string;

  @IsOptional()
  @IsString()
  @Column({ default: '' })
  lastLogInIp?: string;
}
