import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CardScoreLevel } from 'src/card-score/entities/card-score.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyCard } from '../entities/study-card.entity';

export class GetRandomStudyCardsInput {
  @Transform(
    ({ value }) => (value ? value.split(',').map((el) => Number(el)) : []),
    {
      toClassOnly: true,
    },
  )
  @IsNumber({}, { each: true })
  @IsArray()
  studyNoteIds: number[];

  @Transform(({ value }) => (value ? +value : 0), { toClassOnly: true })
  @IsNumber()
  limit: number;

  @Transform(({ value }) => (value ? value.split(',') : []), {
    toClassOnly: true,
  })
  @IsArray()
  @IsEnum(CardScoreLevel, { each: true })
  scores: CardScoreLevel[] = [];
}

export class GetRandomStudyCardsOutput extends CoreOutput {
  @IsArray()
  @IsOptional()
  studyCards?: StudyCard[];
}
