import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/folder/entities/folder.entity';
import { FolderLike } from './entities/folder-like.entity';
import { FolderLikeService } from './folder-like.service';
import { FolderLikeController } from './folder-like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FolderLike, Folder])],
  providers: [FolderLikeService],
  controllers: [FolderLikeController],
})
export class FolderLikeModule {}
