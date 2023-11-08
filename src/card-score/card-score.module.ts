import { Module } from '@nestjs/common';
import { CardScoreService } from './card-score.service';
import { CardScoreController } from './card-score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardScore } from './entities/card-score.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardScore, StudyCard])],
  providers: [CardScoreService],
  controllers: [CardScoreController],
})
export class CardScoreModule {}
