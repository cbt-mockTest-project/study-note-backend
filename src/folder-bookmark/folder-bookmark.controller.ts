import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FolderBookmarkService } from './folder-bookmark.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/decorators/role.decorators';

@Controller('folder-bookmark')
export class FolderBookmarkController {
  constructor(private readonly folderBookmarkService: FolderBookmarkService) {}

  @Role(['any'])
  @Post(':id')
  async createFolderBookmark(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.createFolderBookmark(user.id, +folderId);
  }

  @Role(['any'])
  @Delete(':id')
  async deleteFolderBookmark(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.deleteFolderBookmark(user.id, +folderId);
  }
}
