import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CardComment extends CoreEntity {
  @Column()
  @IsString()
  comment: string;

  @ManyToOne(() => User, (user) => user.cardComments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => StudyCard, (studyCard) => studyCard.cardComments, {
    onDelete: 'CASCADE',
  })
  card: StudyCard;

  isLikedByMe = false;
  isDislikedByMe = false;
}
