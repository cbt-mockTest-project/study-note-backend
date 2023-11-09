import { Module } from '@nestjs/common';
import { FolderReadAccessService } from './folder-read-access.service';
import { FolderReadAccessController } from './folder-read-access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/folder/entities/folder.entity';
import { FolderReadAccess } from './entities/folder-read-access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderReadAccess, Folder])],
  providers: [FolderReadAccessService],
  controllers: [FolderReadAccessController],
})
export class FolderReadAccessModule {}
