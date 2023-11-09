import { IsOptional, IsString } from 'class-validator';
import { CardComment } from 'src/card-comment/entites/card-comment.entity';
import {
  CardScore,
  CardScoreLevel,
} from 'src/card-score/entities/card-score.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class StudyCard extends CoreEntity {
  @IsString()
  @Column()
  question: string;

  @IsString()
  @IsOptional()
  @Column({ default: '' })
  question_img: string;

  @IsOptional()
  @IsString()
  @Column({ default: '' })
  answer: string;

  @IsString()
  @IsOptional()
  @Column({ default: '' })
  answer_img: string;

  @ManyToOne(() => User, (user) => user.studyNotes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => StudyNote, (studyNote) => studyNote.studyCards, {
    onDelete: 'CASCADE',
  })
  studyNote: StudyNote;

  @OneToMany(() => CardScore, (cardScores) => cardScores.studyCard)
  cardScores: StudyNote[];

  @OneToMany(() => CardComment, (cardComments) => cardComments.card)
  cardComments: CardComment[];

  myScore: CardScoreLevel = null;
}
