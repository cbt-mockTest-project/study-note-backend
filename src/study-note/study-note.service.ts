import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyNote } from './entities/study-note.entity';
import { In, Repository } from 'typeorm';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  CreateStudyNoteOutput,
  CreateStudyNoteInput,
} from './dtos/create-study-note.dto';
import {
  GetStudyNotesInput,
  GetStudyNotesOutput,
} from './dtos/get-study-notes.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  UpdateStudyNoteInput,
  UpdateStudyNoteOutput,
} from './dtos/update-study-note.dto';
import { Folder } from 'src/folder/entities/folder.entity';
import { GetStudyNoteOutput } from './dtos/get-study-note.dto copy';
import { CardScore } from 'src/card-score/entities/card-score.entity';
import { GetMyStudyNotesOutput } from './dtos/get-my-study-notes.dto';

@Injectable()
export class StudyNoteService {
  constructor(
    @InjectRepository(Folder)
    private readonly folders: Repository<Folder>,
    @InjectRepository(StudyNote)
    private readonly studyNotes: Repository<StudyNote>,
    @InjectRepository(StudyCard)
    private readonly studyCards: Repository<StudyCard>,
    @InjectRepository(CardScore)
    private readonly cardScores: Repository<CardScore>,
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

  async getMyStudyNotes(user: User): Promise<GetMyStudyNotesOutput> {
    try {
      const studyNotes = await this.studyNotes.find({
        where: {
          user: {
            id: user.id,
          },
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

  async getStudyNote(
    user: User,
    studyNoteId: number,
  ): Promise<GetStudyNoteOutput> {
    try {
      const studyNote = await this.studyNotes.findOne({
        where: {
          id: studyNoteId,
        },
      });
      const orderConditions = studyNote.studyCardOrder
        .map((id, order) => `WHEN ${id} THEN ${order}`)
        .join(' ');
      if (studyNote.studyCardOrder.length === 0) {
        studyNote.studyCards = [];
        return {
          ok: true,
          studyNote,
        };
      }
      const studyCards = await this.studyCards
        .createQueryBuilder('studyCard')
        .where('studyCard.id IN (:...ids)', { ids: studyNote.studyCardOrder })
        .orderBy(`CASE studyCard.id ${orderConditions} END`)
        .getMany();

      if (user) {
        const cardScores = await this.cardScores.find({
          where: {
            studyCard: {
              id: In(studyNote.studyCardOrder),
            },
            user: {
              id: user.id,
            },
          },
          relations: {
            studyCard: true,
          },
        });
        studyCards.forEach((studyCard) => {
          const cardScore = cardScores.find(
            (cardScore) => cardScore.studyCard.id === studyCard.id,
          );
          if (cardScore) {
            studyCard.myScore = cardScore.score;
          }
        });
      }

      studyNote.studyCards = studyCards;
      if (!studyNote) {
        return {
          ok: false,
          error: '암기장을 찾을 수 없습니다.',
        };
      }
      return {
        ok: true,
        studyNote,
      };
    } catch (e) {
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
    const { name, folderId, studyCardOrder } = updateStudyNoteInput;
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
      if (studyCardOrder) {
        studyNote.studyCardOrder = studyCardOrder;
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
