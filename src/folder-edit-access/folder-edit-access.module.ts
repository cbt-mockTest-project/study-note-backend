import { Module } from '@nestjs/common';
import { FolderEditAccessService } from './folder-edit-access.service';
import { FolderEditAccessController } from './folder-edit-access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEditAccess } from './entities/folder-edit-access.entity';
import { Folder } from 'src/folder/entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEditAccess, Folder])],
  providers: [FolderEditAccessService],
  controllers: [FolderEditAccessController],
})
export class FolderEditAccessModule {}
