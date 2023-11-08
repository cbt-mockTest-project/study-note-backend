import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FolderLike } from './entities/folder-like.entity';
import { Repository } from 'typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Folder } from 'src/folder/entities/folder.entity';

@Injectable()
export class FolderLikeService {
  constructor(
    @InjectRepository(FolderLike)
    private readonly folderLikes: Repository<FolderLike>,
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
  ) {}

  async createFolderLike(
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
      const folderLike = await this.folderLikes.findOne({
        where: {
          user: {
            id: userId,
          },
          folder: {
            id: folderId,
          },
        },
      });
      if (folderLike) {
        return {
          ok: false,
          error: '이미 좋아요한 폴더입니다.',
        };
      }
      await this.folderLikes.save(
        this.folderLikes.create({
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
        error: '좋아요에 실패했습니다.',
      };
    }
  }

  async deleteFolderLike(userId: number, folderId: number) {
    try {
      const folderLike = await this.folderLikes.findOne({
        where: {
          user: {
            id: userId,
          },
          folder: {
            id: folderId,
          },
        },
      });
      if (!folderLike) {
        return {
          ok: false,
          error: '좋아요를 누르지 않은 폴더입니다.',
        };
      }
      await this.folderLikes.delete(folderLike.id);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '좋아요 취소에 실패했습니다.',
      };
    }
  }
}
