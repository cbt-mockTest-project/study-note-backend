import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FolderEditAccessService } from './folder-edit-access.service';
import { Role } from 'src/common/decorators/role.decorators';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('folder-edit-access')
export class FolderEditAccessController {
  constructor(
    private readonly folderEditAccessService: FolderEditAccessService,
  ) {}

  @Role(['any'])
  @Post(':id')
  createFolderEditAccess(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: number,
  ) {
    return this.folderEditAccessService.createFolderEditAccess(user, folderId);
  }

  @Role(['any'])
  @Delete(':id')
  deleteFolderEditAccess(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) accessId: number,
  ) {
    return this.folderEditAccessService.deleteFolderEditAccess(user, accessId);
  }

  @Role(['any'])
  @Get(':id')
  getFolderEditAccesses(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: number,
  ) {
    return this.folderEditAccessService.getFolderEditAccesses(user, folderId);
  }
}
