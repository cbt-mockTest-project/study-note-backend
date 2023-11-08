import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CardScoreService } from './card-score.service';
import { Role } from 'src/common/decorators/role.decorators';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { SaveCardScoreInput } from './dtos/save-card-score.dto';

@Controller('card-score')
export class CardScoreController {
  constructor(private readonly cardScoreService: CardScoreService) {}

  @Role(['any'])
  @Post(':id')
  async saveCardScore(
    @Param('id', ParseIntPipe) studyCardId: string,
    @AuthUser() user: User,
    @Body() saveCardScoreInput: SaveCardScoreInput,
  ) {
    return this.cardScoreService.saveCardScore(
      user,
      +studyCardId,
      saveCardScoreInput,
    );
  }
}
