import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FolderBookmark } from './entities/folder-bookmark.entity';
import { Repository } from 'typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Folder } from 'src/folder/entities/folder.entity';

@Injectable()
export class FolderBookmarkService {
  constructor(
    @InjectRepository(FolderBookmark)
    private readonly folderBookmarks: Repository<FolderBookmark>,
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
  ) {}

  async createFolderBookmark(
    userId: number,
    folderId: number,
  ): Promise<CoreOutput> {
    try {
      const folder = await this.folders.findOne({
        where: {
          user: {
            id: userId,
          },
          id: folderId,
        },
      });
      if (!folder) {
        return {
          ok: false,
          error: '존재하지 않는 폴더입니다.',
        };
      }
      const folderBookmark = await this.folderBookmarks.findOne({
        where: {
          user: {
            id: userId,
          },
          folder: {
            id: folderId,
          },
        },
      });
      if (folderBookmark) {
        return {
          ok: false,
          error: '이미 북마크한 폴더입니다.',
        };
      }
      await this.folderBookmarks.save(
        this.folderBookmarks.create({
          user: {
            id: userId,
          },
          folder: {
            id: folderId,
          },
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '북마크를 할 수 없습니다.',
      };
    }
  }

  async deleteFolderBookmark(userId: number, folderId: number) {
    try {
      const folderBookmark = await this.folderBookmarks.findOne({
        where: {
          user: {
            id: userId,
          },
          folder: {
            id: folderId,
          },
        },
      });
      if (!folderBookmark) {
        return {
          ok: false,
          error: '북마크를 찾을 수 없습니다.',
        };
      }
      await this.folderBookmarks.delete(folderBookmark.id);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '북마크를 삭제할 수 없습니다.',
      };
    }
  }
}
