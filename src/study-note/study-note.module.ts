import { Module } from '@nestjs/common';
import { StudyNoteController } from './study-note.controller';
import { StudyNoteService } from './study-note.service';

@Module({
  controllers: [StudyNoteController],
  providers: [StudyNoteService]
})
export class StudyNoteModule {}
