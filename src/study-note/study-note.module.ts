import { Module } from '@nestjs/common';
import { StudyNoteController } from './study-note.controller';
import { StudyNoteService } from './study-note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyNote } from './entities/study-note.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { Folder } from 'src/folder/entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyNote, Question, User, Folder])],
  controllers: [StudyNoteController],
  providers: [StudyNoteService],
})
export class StudyNoteModule {}
