import { Module } from '@nestjs/common';
import { FolderBookmarkService } from './folder-bookmark.service';
import { FolderBookmarkController } from './folder-bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderBookmark } from './entities/folder-bookmark.entity';
import { Folder } from 'src/folder/entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderBookmark, Folder])],
  providers: [FolderBookmarkService],
  controllers: [FolderBookmarkController],
})
export class FolderBookmarkModule {}
