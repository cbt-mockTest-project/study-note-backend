import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CardComment } from 'src/card-comment/entites/card-comment.entity';
import { CardScore } from 'src/card-score/entities/card-score.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { FolderBookmark } from 'src/folder-bookmark/entities/folder-bookmark.entity';
import { FolderEditAccess } from 'src/folder-edit-access/entities/folder-edit-access.entity';
import { FolderLike } from 'src/folder-like/entities/folder-like.entity';
import { FolderReadAccess } from 'src/folder-read-access/entities/folder-read-access.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { History } from 'src/history/entites/history.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

export enum LoginType {
  GOOGLE = 'google',
  KAKAO = 'kakao',
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
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

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

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

  @OneToMany(() => FolderBookmark, (folderBookmarks) => folderBookmarks.user)
  folderBookmarks: FolderBookmark[];

  @OneToMany(() => FolderLike, (folderLikes) => folderLikes.user)
  folderLikes: FolderLike[];

  @OneToMany(() => CardScore, (cardScores) => cardScores.user)
  cardScores: CardScore[];

  @OneToMany(
    () => FolderReadAccess,
    (folderReadAccesses) => folderReadAccesses.user,
  )
  folderReadAccesses: FolderReadAccess[];

  @OneToMany(
    () => FolderEditAccess,
    (folderEditAccesses) => folderEditAccesses.user,
  )
  folderEditAccesses: FolderEditAccess[];

  @OneToMany(() => CardComment, (cardComment) => cardComment.user)
  cardComments: CardComment[];

  @OneToOne(() => History, (history) => history.user)
  history: History;
}
