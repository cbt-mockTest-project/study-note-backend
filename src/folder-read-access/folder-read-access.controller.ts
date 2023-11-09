import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FolderReadAccessService } from './folder-read-access.service';
import { Role } from 'src/common/decorators/role.decorators';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('folder-read-access')
export class FolderReadAccessController {
  constructor(
    private readonly folderReadAccessService: FolderReadAccessService,
  ) {}

  @Role(['any'])
  @Post(':id')
  createFolderReadAccess(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: number,
  ) {
    return this.folderReadAccessService.createFolderReadAccess(user, folderId);
  }

  @Role(['any'])
  @Delete(':id')
  deleteFolderReadAccess(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) accessId: number,
  ) {
    return this.folderReadAccessService.deleteFolderReadAccess(user, accessId);
  }

  @Role(['any'])
  @Get(':id')
  getFolderReadAccesses(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: number,
  ) {
    return this.folderReadAccessService.getFolderReadAccesses(user, folderId);
  }
}
