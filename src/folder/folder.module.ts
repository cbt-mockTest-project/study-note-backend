import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, StudyNote, Question, User])],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
