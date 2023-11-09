import { Injectable } from '@nestjs/common';
import { FolderEditAccess } from './entities/folder-edit-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { GetFolderEditAccessesOutput } from './dtos/get-folder-edit-accesses.dto';

@Injectable()
export class FolderEditAccessService {
  constructor(
    @InjectRepository(FolderEditAccess)
    private readonly folderEditAccesses: Repository<FolderEditAccess>,
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
  ) {}

  async createFolderEditAccess(
    user: User,
    folderId: number,
  ): Promise<CoreOutput> {
    try {
      const folder = await this.folders.findOne({
        where: { id: folderId },
      });
      if (!folder) {
        return { ok: false, error: '폴더를 찾을 수 없습니다.' };
      }
      const exist = await this.folderEditAccesses.findOne({
        where: {
          user: {
            id: user.id,
          },
          folder: {
            id: folderId,
          },
        },
      });
      if (exist) {
        return { ok: false, error: '이미 폴더 편집 권한이 있습니다.' };
      }
      const folderEditAccess = this.folderEditAccesses.create({
        user,
        folder,
      });
      await this.folderEditAccesses.save(folderEditAccess);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '폴더 편집 권한을 생성 할 수 없습니다.' };
    }
  }

  async deleteFolderEditAccess(
    user: User,
    accessId: number,
  ): Promise<CoreOutput> {
    try {
      const folderEditAccess = await this.folderEditAccesses.findOne({
        where: {
          id: accessId,
          folder: {
            user: {
              id: user.id,
            },
          },
        },
      });
      if (!folderEditAccess) {
        return { ok: false, error: '폴더 편집 권한을 찾을 수 없습니다.' };
      }
      await this.folderEditAccesses.delete(folderEditAccess.id);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '폴더 편집 권한을 삭제 할 수 없습니다.' };
    }
  }

  async getFolderEditAccesses(
    user: User,
    folderId: number,
  ): Promise<GetFolderEditAccessesOutput> {
    try {
      const folderEditAccesses = await this.folderEditAccesses.find({
        where: {
          folder: {
            id: folderId,
            user: {
              id: user.id,
            },
          },
        },
        relations: {
          user: true,
        },
      });
      return {
        ok: true,
        folderEditAccesses,
      };
    } catch (e) {
      return { ok: false, error: '폴더 편집 권한을 가져올 수 없습니다.' };
    }
  }
}
