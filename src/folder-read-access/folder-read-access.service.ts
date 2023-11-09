import { Injectable } from '@nestjs/common';
import { FolderReadAccess } from './entities/folder-read-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { GetFolderReadAccessesOutput } from './dtos/get-folder-read-accesses.dto';

@Injectable()
export class FolderReadAccessService {
  constructor(
    @InjectRepository(FolderReadAccess)
    private readonly folderReadAccesses: Repository<FolderReadAccess>,
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
  ) {}

  async createFolderReadAccess(
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
      const exist = await this.folderReadAccesses.findOne({
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
        return { ok: false, error: '이미 폴더 읽기 권한이 있습니다.' };
      }
      const folderReadAccess = this.folderReadAccesses.create({
        user,
        folder,
      });
      await this.folderReadAccesses.save(folderReadAccess);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '폴더 읽기 권한을 생성 할 수 없습니다.' };
    }
  }

  async deleteFolderReadAccess(
    user: User,
    accessId: number,
  ): Promise<CoreOutput> {
    try {
      const folderReadAccess = await this.folderReadAccesses.findOne({
        where: {
          id: accessId,
          folder: {
            user: {
              id: user.id,
            },
          },
        },
      });
      if (!folderReadAccess) {
        return { ok: false, error: '폴더 읽기 권한을 찾을 수 없습니다.' };
      }
      await this.folderReadAccesses.delete(folderReadAccess.id);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '폴더 읽기 권한을 삭제 할 수 없습니다.' };
    }
  }

  async getFolderReadAccesses(
    user: User,
    folderId: number,
  ): Promise<GetFolderReadAccessesOutput> {
    try {
      const folderReadAccesses = await this.folderReadAccesses.find({
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
        folderReadAccesses,
      };
    } catch (e) {
      return { ok: false, error: '폴더 읽기 권한을 가져올 수 없습니다.' };
    }
  }
}
