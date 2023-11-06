import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Folder extends CoreEntity {
  @IsString()
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.folders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => StudyNote, (studyNotes) => studyNotes.folder)
  studyNotes: StudyNote[];
}
