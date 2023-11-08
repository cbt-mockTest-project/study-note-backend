import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderInput } from './dto/create-folder.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetMyFoldersInput } from './dto/get-my-folders.dto';
import { UpdateFolderInput } from './dto/update-folder.dto';
import { Role } from 'src/common/decorators/role.decorators';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}
  @Role(['any'])
  @Post()
  createFolder(
    @AuthUser() user: User,
    @Body() createFolderInput: CreateFolderInput,
  ) {
    return this.folderService.createFolder(user, createFolderInput);
  }

  @Role(['any'])
  @Get('')
  getMyFolders(
    @AuthUser() user: User,
    @Query() getFoldersInput: GetMyFoldersInput,
  ) {
    return this.folderService.getMyFolders(user, getFoldersInput);
  }

  @Get(':id')
  getFolder(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ) {
    return this.folderService.getFolder(user, +folderId);
  }

  @Role(['any'])
  @Delete(':id')
  deleteFolder(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ) {
    return this.folderService.deleteFolder(user, +folderId);
  }

  @Role(['any'])
  @Patch(':id')
  updateFolder(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
    @Body() updateFolderInput: UpdateFolderInput,
  ) {
    return this.folderService.updateFolder(user, +folderId, updateFolderInput);
  }
}
