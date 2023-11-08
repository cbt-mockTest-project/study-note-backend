import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { FolderBookmark } from 'src/folder-bookmark/entities/folder-bookmark.entity';
import { FolderLike } from 'src/folder-like/entities/folder-like.entity';
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
}
