import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { Column, Entity, OneToMany } from 'typeorm';

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
  @Column({ default: '', select: false })
  lastLogInIp?: string;

  @OneToMany(() => Folder, (folder) => folder.user)
  folders: Folder[];

  @OneToMany(() => StudyNote, (studyNote) => studyNote.user)
  studyNotes: StudyNote[];

  @OneToMany(() => StudyCard, (studyCard) => studyCard.user)
  studyCards: StudyCard[];
}
