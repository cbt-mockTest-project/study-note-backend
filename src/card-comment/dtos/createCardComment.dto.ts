import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CardComment } from '../entites/card-comment.entity';
import { IsOptional } from 'class-validator';

export class CreateCardCommentInput extends PickType(CardComment, [
  'comment',
]) {}

export class CreateCardCommentOutput extends CoreOutput {
  @IsOptional()
  cardComment?: CardComment;
}
