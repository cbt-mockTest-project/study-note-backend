import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyNote } from './entities/study-note.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import {
  CreateStudyNoteOutput,
  CreateStudyNoteInput,
} from './dto/create-study-note.dto';
import {
  GetStudyNotesInput,
  GetStudyNotesOutput,
} from './dto/get-study-notes.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  UpdateStudyNoteInput,
  UpdateStudyNoteOutput,
} from './dto/update-study-note.dto';
import { Folder } from 'src/folder/entities/folder.entity';

@Injectable()
export class StudyNoteService {
  constructor(
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
    @InjectRepository(StudyNote)
    private readonly studyNotes: Repository<StudyNote>,
    @InjectRepository(Question)
    private readonly questions: Repository<Question>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async createStudyNote(
    user: User,
    createStudyNoteInput: CreateStudyNoteInput,
  ): Promise<CreateStudyNoteOutput> {
    try {
      const { name, folderId } = createStudyNoteInput;
      if (folderId) {
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
      }
      const studyNote = await this.studyNotes.save(
        this.studyNotes.create({
          name,
          folder: {
            id: folderId,
          },
          user,
        }),
      );
      return {
        ok: true,
        studyNote,
      };
    } catch {
      return {
        ok: false,
        error: '암기장을 생성하는데 실패했습니다.',
      };
    }
  }

  async getStudyNotes(
    user: User,
    getStudyNotesInput: GetStudyNotesInput,
  ): Promise<GetStudyNotesOutput> {
    try {
      const { folderId } = getStudyNotesInput;
      const studyNotes = await this.studyNotes.find({
        where: {
          folder: {
            id: folderId,
          },
          user: {
            id: user.id,
          },
        },
        order: {
          created_at: 'DESC',
        },
      });
      return {
        ok: true,
        studyNotes,
      };
    } catch {
      return {
        ok: false,
        error: '암기장을 불러오는데 실패했습니다.',
      };
    }
  }

  async deleteStudyNote(user: User, studyNoteId: number): Promise<CoreOutput> {
    try {
      const studyNote = await this.studyNotes.findOne({
        where: {
          id: studyNoteId,
          user: {
            id: user.id,
          },
        },
      });
      if (!studyNote) {
        return {
          ok: false,
          error: '암기장을 찾을 수 없습니다.',
        };
      }
      await this.studyNotes.delete(studyNoteId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '암기장을 삭제하는데 실패했습니다.',
      };
    }
  }

  async updateStudyNote(
    user: User,
    studyNoteId: number,
    updateStudyNoteInput: UpdateStudyNoteInput,
  ): Promise<UpdateStudyNoteOutput> {
    const { name, folderId } = updateStudyNoteInput;
    try {
      const studyNote = await this.studyNotes.findOne({
        where: {
          id: studyNoteId,
          user: {
            id: user.id,
          },
        },
        relations: {
          folder: true,
        },
      });
      if (!studyNote) {
        return {
          ok: false,
          error: '암기장을 찾을 수 없습니다.',
        };
      }
      if (folderId) {
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
        studyNote.folder = folder;
      }
      if (name) {
        studyNote.name = name;
      }
      await this.studyNotes.save(studyNote);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '암기장을 수정하는데 실패했습니다.',
      };
    }
  }
}
