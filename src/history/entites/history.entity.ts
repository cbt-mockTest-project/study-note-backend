import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { CardScoreLevel } from 'src/card-score/entities/card-score.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

enum StudyOrder {
  Random = 'random',
  Normal = 'normal',
}

enum StudyMode {
  Answer = 'answer',
  Card = 'card',
  Typing = 'typing',
}

export class StudySetting {
  @IsNumber()
  @Min(0)
  folderId: number;

  @IsOptional()
  @IsNumber()
  limit?: number = null;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  studyNoteIds: number[];

  @IsOptional()
  @IsArray()
  @ValidateIf((o) => Array.isArray(o.scores) && o.scores.length > 0)
  @IsIn(Object.values(CardScoreLevel), { each: true })
  scores?: CardScoreLevel[];

  @IsEnum(StudyMode)
  mode: StudyMode;

  @IsEnum(StudyOrder)
  order: StudyOrder = StudyOrder.Normal;
}

@Entity()
export class History extends CoreEntity {
  @OneToOne(() => User, (user) => user.history, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'json', default: null })
  studySettings: StudySetting[];
}
