import { IsEmail } from 'class-validator';
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

  @Column({ type: 'enum', enum: LoginType })
  loginType: LoginType;

  @Column({ default: '' })
  lastLogInIp: string;
}
