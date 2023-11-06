import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Question extends CoreEntity {
  @IsString()
  @Column()
  question: string;

  @IsString()
  @Column()
  question_img: string;

  @IsString()
  @Column({ default: '' })
  answer: string;

  @IsString()
  @Column({ default: '' })
  answer_img: string;

  @ManyToOne(() => User, (user) => user.studyNotes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => StudyNote, (studyNote) => studyNote.questions, {
    onDelete: 'CASCADE',
  })
  studyNote: StudyNote;
}
