import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Repository } from 'typeorm';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateFolderOutput, CreateFolderInput } from './dto/create-folder.dto';
import { GetFoldersInput, GetFoldersOutput } from './dto/get-folders.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UpdateFolderInput, UpdateFolderOutput } from './dto/update-folder.dto';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { FolderBookmark } from 'src/folder-bookmark/entities/folder-bookmark.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
    @InjectRepository(FolderBookmark)
    private readonly folderBookmarks: Repository<FolderBookmark>,
    @InjectRepository(StudyNote)
    private readonly studyNotes: Repository<StudyNote>,
    @InjectRepository(StudyCard)
    private readonly studyCards: Repository<StudyCard>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async createFolder(
    user: User,
    createFolderInput: CreateFolderInput,
  ): Promise<CreateFolderOutput> {
    try {
      const folder = await this.folders.save(
        this.folders.create({ ...createFolderInput, user }),
      );
      return {
        ok: true,
        folder,
      };
    } catch {
      return {
        ok: false,
        error: '폴더를 생성하는데 실패했습니다.',
      };
    }
  }

  async getFolders(
    user: User,
    getFoldersInput: GetFoldersInput,
  ): Promise<GetFoldersOutput> {
    try {
      const { access, filter } = getFoldersInput;
      let folders: Folder[] = [];
      if (filter === 'bookmark') {
        const folderBookmarks = await this.folderBookmarks.find({
          where: {
            user: {
              id: user.id,
            },
          },
          relations: {
            folder: true,
          },
          order: {
            created_at: 'DESC',
          },
        });
        folders = folderBookmarks.map((folderBookmark) => {
          return folderBookmark.folder;
        });
      }
      if (filter === 'me') {
        folders = await this.folders.find({
          where: {
            access,
            user: {
              id: user.id,
            },
          },
          order: {
            created_at: 'DESC',
          },
        });
      }

      return {
        ok: true,
        folders,
      };
    } catch {
      return {
        ok: false,
        error: '폴더를 불러오는데 실패했습니다.',
      };
    }
  }

  async deleteFolder(user: User, folderId: number): Promise<CoreOutput> {
    try {
      const folder = await this.folders.findOne({
        where: {
          id: folderId,
          user: {
            id: user.id,
          },
        },
      });
      if (!folder) {
        return {
          ok: false,
          error: '폴더를 찾을 수 없습니다.',
        };
      }
      await this.folders.delete(folderId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '폴더를 삭제하는데 실패했습니다.',
      };
    }
  }

  async updateFolder(
    user: User,
    folderId: number,
    updateFolderInput: UpdateFolderInput,
  ): Promise<UpdateFolderOutput> {
    const { access, name } = updateFolderInput;
    try {
      const folder = await this.folders.findOne({
        where: {
          id: folderId,
          user: {
            id: user.id,
          },
        },
      });
      if (!folder) {
        return {
          ok: false,
          error: '폴더를 찾을 수 없습니다.',
        };
      }
      if (access) {
        folder.access = access;
      }
      if (name) {
        folder.name = name;
      }
      await this.folders.save(folder);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '폴더를 수정하는데 실패했습니다.',
      };
    }
  }
}
