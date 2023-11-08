import { PickType } from '@nestjs/mapped-types';
import { CardScore } from '../entities/card-score.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class SaveCardScoreInput extends PickType(CardScore, ['score']) {
  studyCardId: number;
}

export class SaveCardScoreOutput extends CoreOutput {}
