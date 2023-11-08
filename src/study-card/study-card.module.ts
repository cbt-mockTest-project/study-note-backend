import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { StudyCardController } from './study-card.controller';
import { StudyCardService } from './study-card.service';
import { CardScore } from 'src/card-score/entities/card-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyNote, StudyCard, CardScore, User])],
  controllers: [StudyCardController],
  providers: [StudyCardService],
})
export class StudyCardModule {}
