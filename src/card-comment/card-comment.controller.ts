import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CardCommentService } from './card-comment.service';
import { Role } from 'src/common/decorators/role.decorators';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateCardCommentInput } from './dtos/createCardComment.dto';
import { UpdateCardCommentInput } from './dtos/updateCardComment';

@Controller('card-comment')
export class CardCommentController {
  constructor(private readonly cardCommentService: CardCommentService) {}

  @Role(['any'])
  @Post(':id')
  createCardComment(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) cardId: number,
    @Body() createCardCommentInput: CreateCardCommentInput,
  ) {
    return this.cardCommentService.createCardComment(
      user,
      cardId,
      createCardCommentInput,
    );
  }

  @Role(['any'])
  @Patch(':id')
  updateCardComment(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) cardCommentId: number,
    @Body() updateCardCommentInput: UpdateCardCommentInput,
  ) {
    return this.cardCommentService.updateCardComment(
      user,
      cardCommentId,
      updateCardCommentInput,
    );
  }

  @Role(['any'])
  @Delete(':id')
  deleteCardComment(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) cardCommentId: number,
  ) {
    return this.cardCommentService.deleteCardComment(user, cardCommentId);
  }
}
