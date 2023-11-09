import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CardComment } from '../entites/card-comment.entity';
import { IsOptional } from 'class-validator';

export class UpdateCardCommentInput extends PickType(CardComment, [
  'comment',
]) {}

export class UpdateCardCommentOutput extends CoreOutput {
  @IsOptional()
  cardComment?: CardComment;
}
