import { Module } from '@nestjs/common';
import { StudyCardController } from './study-card.controller';
import { StudyCardService } from './study-card.service';

@Module({
  controllers: [StudyCardController],
  providers: [StudyCardService],
})
export class StudyCardModule {}
