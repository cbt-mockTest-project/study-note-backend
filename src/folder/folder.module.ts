import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, StudyNote, StudyCard, User])],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
