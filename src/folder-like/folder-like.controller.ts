import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FolderLikeService } from './folder-like.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Role } from 'src/common/decorators/role.decorators';

@Controller('folder-like')
export class FolderLikeController {
  constructor(private readonly folderBookmarkService: FolderLikeService) {}

  @Role(['any'])
  @Post(':id')
  async createFolderLike(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.createFolderLike(user.id, +folderId);
  }

  @Role(['any'])
  @Delete(':id')
  async deleteFolderLike(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.deleteFolderLike(user.id, +folderId);
  }
}
