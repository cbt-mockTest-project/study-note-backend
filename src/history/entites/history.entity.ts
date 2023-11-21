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

enum StudyMode {
  Random = 'random',
  Normal = 'normal',
}

export class SelectedNotes {
  @IsNumber()
  @Min(0)
  folderId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  noteIds: number[];
}

export class StudySetting {
  @IsOptional()
  @IsArray()
  @ValidateIf((o) => Array.isArray(o.scores) && o.scores.length > 0)
  @IsIn(Object.values(CardScoreLevel), { each: true })
  scores?: CardScoreLevel[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  limit?: number;

  @IsEnum(StudyMode)
  order: StudyMode = StudyMode.Normal;
}

@Entity()
export class History extends CoreEntity {
  @OneToOne(() => User, (user) => user.history, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'json', default: null })
  selectedNotes: SelectedNotes;

  @Column({ type: 'json', default: null })
  studySetting: StudySetting;
}
