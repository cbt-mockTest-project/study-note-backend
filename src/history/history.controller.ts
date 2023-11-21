import { Body, Controller, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { SaveHistoryInput } from './dtos/saveHistory.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/decorators/role.decorators';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  @Post('')
  @Role(['any'])
  saveHistory(
    @AuthUser() user: User,
    @Body() saveHistoryInput: SaveHistoryInput,
  ) {
    return this.historyService.saveHistory(user, saveHistoryInput);
  }
}
