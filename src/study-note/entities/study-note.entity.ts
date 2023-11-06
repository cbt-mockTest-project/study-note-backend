import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class StudyNote extends CoreEntity {
  @ManyToOne(() => User, (user) => user.studyNotes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.studyNotes, { nullable: true })
  folder: Folder;

  @OneToMany(() => Question, (question) => question.studyNote)
  questions: Question[];

  @Column({ type: 'json', default: [] })
  questionOrder: number[];
}
