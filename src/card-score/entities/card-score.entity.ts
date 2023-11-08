import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum CardScoreLevel {
  HiGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

@Entity()
export class CardScore extends CoreEntity {
  @IsEnum(CardScoreLevel)
  @Column({ type: 'enum', enum: CardScoreLevel })
  score: CardScoreLevel;

  @ManyToOne(() => User, (user) => user.cardScores, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => StudyCard, (studyCard) => studyCard.cardScores, {
    onDelete: 'CASCADE',
  })
  studyCard: StudyCard;
}
