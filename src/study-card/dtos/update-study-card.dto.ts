import { PartialType, PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyCard } from '../entities/study-card.entity';

export class UpdateStudyCardInput extends PartialType(
  PartialType(
    PickType(StudyCard, ['question', 'answer', 'question_img', 'answer_img']),
  ),
) {}

export class UpdateStudyCardOutput extends CoreOutput {}
