import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { FolderBookmark } from 'src/folder-bookmark/entities/folder-bookmark.entity';
import { FolderEditAccess } from 'src/folder-edit-access/entities/folder-edit-access.entity';
import { FolderLike } from 'src/folder-like/entities/folder-like.entity';
import { FolderReadAccess } from 'src/folder-read-access/entities/folder-read-access.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

export enum FolderAccess {
  PUBLIC = 'public',
  SECRET = 'secret',
}

@Entity()
export class Folder extends CoreEntity {
  @IsString()
  @Column()
  name: string;

  @IsString()
  @IsOptional()
  @Column({ default: '' })
  description: string;

  @IsEnum(FolderAccess)
  @Column({ type: 'enum', enum: FolderAccess })
  access: FolderAccess;

  @ManyToOne(() => User, (user) => user.folders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => StudyNote, (studyNotes) => studyNotes.folder)
  studyNotes: StudyNote[];

  @OneToMany(() => FolderBookmark, (folderBookmark) => folderBookmark.folder)
  folderBookmarks: FolderBookmark[];

  @OneToMany(() => FolderLike, (folderLike) => folderLike.folder)
  folderLikes: FolderLike[];

  @OneToMany(
    () => FolderReadAccess,
    (folderReadAccesses) => folderReadAccesses.folder,
  )
  folderReadAccesses: FolderReadAccess[];

  @OneToMany(
    () => FolderEditAccess,
    (folderEditAccesses) => folderEditAccesses.folder,
  )
  folderEditAccesses: FolderEditAccess[];
}
