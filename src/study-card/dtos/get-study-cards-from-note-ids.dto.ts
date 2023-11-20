import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CardScoreLevel } from 'src/card-score/entities/card-score.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyCard } from '../entities/study-card.entity';

export class GetStudyCardsFromNoteIdsInput {
  @Transform(
    ({ value }) => (value ? value.split(',').map((el) => Number(el)) : []),
    {
      toClassOnly: true,
    },
  )
  @IsNumber({}, { each: true })
  @IsArray()
  studyNoteIds: number[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === 'random' ? 'random' : 'normal'), {
    toClassOnly: true,
  })
  order: 'random' | 'normal' = 'normal';

  @Transform(({ value }) => (value ? +value : 0), { toClassOnly: true })
  @IsNumber()
  @IsOptional()
  limit: number;

  @Transform(({ value }) => (value ? value.split(',') : []), {
    toClassOnly: true,
  })
  @IsArray()
  @IsEnum(CardScoreLevel, { each: true })
  scores: CardScoreLevel[] = [];
}

export class GetStudyCardsFromNoteIdsOutput extends CoreOutput {
  @IsArray()
  @IsOptional()
  studyCards?: StudyCard[];
}
