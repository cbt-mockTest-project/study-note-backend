import { Module } from '@nestjs/common';
import { CardScoreService } from './card-score.service';
import { CardScoreController } from './card-score.controller';

@Module({
  providers: [CardScoreService],
  controllers: [CardScoreController]
})
export class CardScoreModule {}
