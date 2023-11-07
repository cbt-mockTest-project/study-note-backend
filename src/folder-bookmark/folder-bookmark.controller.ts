import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FolderBookmarkService } from './folder-bookmark.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('folder-bookmark')
export class FolderBookmarkController {
  constructor(private readonly folderBookmarkService: FolderBookmarkService) {}

  @UseGuards(JwtGuard)
  @Post(':id')
  async createFolderBookmark(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.createFolderBookmark(user.id, +folderId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteFolderBookmark(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.deleteFolderBookmark(user.id, +folderId);
  }
}
