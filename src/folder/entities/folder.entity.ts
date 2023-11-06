import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
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

  @ManyToOne(() => User, (user) => user.folders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => StudyNote, (studyNotes) => studyNotes.folder)
  studyNotes: StudyNote[];

  @IsEnum(FolderAccess)
  @IsOptional()
  @Column({ type: 'enum', enum: FolderAccess, default: FolderAccess.SECRET })
  access?: FolderAccess;
}
