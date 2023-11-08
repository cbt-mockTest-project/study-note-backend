import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FolderLikeService } from './folder-like.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('folder-like')
export class FolderLikeController {
  constructor(private readonly folderBookmarkService: FolderLikeService) {}

  @UseGuards(JwtGuard)
  @Post(':id')
  async createFolderLike(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.createFolderLike(user.id, +folderId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteFolderLike(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) folderId: string,
  ): Promise<CoreOutput> {
    return this.folderBookmarkService.deleteFolderLike(user.id, +folderId);
  }
}
