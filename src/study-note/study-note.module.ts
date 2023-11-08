import { Module } from '@nestjs/common';
import { StudyNoteController } from './study-note.controller';
import { StudyNoteService } from './study-note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyNote } from './entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { CardScore } from 'src/card-score/entities/card-score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyNote, StudyCard, CardScore, User, Folder]),
  ],
  controllers: [StudyNoteController],
  providers: [StudyNoteService],
})
export class StudyNoteModule {}
