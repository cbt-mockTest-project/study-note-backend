import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderInput } from './dto/create-folder.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetFoldersInput } from './dto/get-folders.dto';
import { UpdateFolderInput } from './dto/update-folder.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@AuthUser() user: User, @Body() createFolderInput: CreateFolderInput) {
    return this.folderService.createFolder(user, createFolderInput);
  }

  @UseGuards(JwtGuard)
  @Get('')
  getMyFolders(
    @AuthUser() user: User,
    @Query() getFoldersInput: GetFoldersInput,
  ) {
    return this.folderService.getFolders(user, getFoldersInput);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteFolder(@AuthUser() user: User, @Param('id') folderId: string) {
    return this.folderService.deleteFolder(user, +folderId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateFolder(
    @AuthUser() user: User,
    @Param('id') folderId: string,
    @Body() updateFolderInput: UpdateFolderInput,
  ) {
    return this.folderService.updateFolder(user, +folderId, updateFolderInput);
  }
}
