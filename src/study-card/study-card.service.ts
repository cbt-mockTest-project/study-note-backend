import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  CreateStudyCardOutput,
  CreateStudyCardInput,
} from './dtos/create-study-card.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyCard } from './entities/study-card.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import {
  UpdateStudyCardInput,
  UpdateStudyCardOutput,
} from './dtos/update-study-card.dto';
import {
  GetStudyCardsFromNoteIdsInput,
  GetStudyCardsFromNoteIdsOutput,
} from './dtos/get-study-cards-from-note-ids.dto';
import { CardScore } from 'src/card-score/entities/card-score.entity';
import { shuffle } from 'lodash';

@Injectable()
export class StudyCardService {
  constructor(
    @InjectRepository(StudyNote)
    private readonly studyNotes: Repository<StudyNote>,
    @InjectRepository(StudyCard)
    private readonly studyCards: Repository<StudyCard>,
    @InjectRepository(CardScore)
    private readonly cardScores: Repository<CardScore>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async createStudyCard(
    user: User,
    studyNoteId: number,
    createStudyCardInput: CreateStudyCardInput,
  ): Promise<CreateStudyCardOutput> {
    const queryRunner = this.studyCards.manager.connection.createQueryRunner();
    try {
      const { question, question_img, answer, answer_img, studyCardOrder } =
        createStudyCardInput;
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
      await queryRunner.startTransaction();
      const studyCard = await queryRunner.manager.save(
        this.studyCards.create({
          question,
          question_img,
          answer,
          answer_img,
          studyNote,
          user,
        }),
      );
      await queryRunner.manager.update(
        StudyNote,
        { id: studyNoteId },
        { studyCardOrder },
      );

      await queryRunner.commitTransaction();

      return {
        studyCard,
        ok: true,
      };
    } catch {
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        error: '카드를 생성하는데 실패했습니다.',
      };
    } finally {
      await queryRunner.release();
    }
  }

  async deleteStudyCard(user: User, studyCardId: number): Promise<CoreOutput> {
    try {
      const studyCard = await this.studyCards.findOne({
        where: {
          id: studyCardId,
          user: {
            id: user.id,
          },
        },
      });
      if (!studyCard) {
        return {
          ok: false,
          error: '카드를 찾을 수 없습니다.',
        };
      }
      await this.studyCards.delete(studyCardId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '카드를 삭제하는데 실패했습니다.',
      };
    }
  }

  async updateStudyCard(
    user: User,
    studyCardId: number,
    updateStudyCardInput: UpdateStudyCardInput,
  ): Promise<UpdateStudyCardOutput> {
    const { question, question_img, answer, answer_img } = updateStudyCardInput;
    try {
      const studyCard = await this.studyCards.findOne({
        where: {
          id: studyCardId,
          user: {
            id: user.id,
          },
        },
      });
      if (!studyCard) {
        return {
          ok: false,
          error: '카드를 찾을 수 없습니다.',
        };
      }
      if (question) studyCard.question = question;
      if (question_img) studyCard.question_img = question_img;
      if (answer) studyCard.answer = answer;
      if (answer_img) studyCard.answer_img = answer_img;
      await this.studyCards.save(studyCard);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '카드를 수정하는데 실패했습니다.',
      };
    }
  }

  async getStudyCardsFromNoteIds(
    user: User,
    getRandomStudyCardsInput: GetStudyCardsFromNoteIdsInput,
  ): Promise<GetStudyCardsFromNoteIdsOutput> {
    try {
      const { studyNoteIds, limit, scores, order } = getRandomStudyCardsInput;
      const studyNotes = await this.studyNotes.find({
        where: {
          id: In(studyNoteIds),
        },
        relations: { studyCards: true },
      });

      let studyCards: StudyCard[] = [];

      if (order === 'random') {
        studyCards = studyNotes.flatMap((note) => note.studyCards);
        studyCards = shuffle(studyCards);
      }
      if (order === 'normal') {
        studyNotes.forEach((note) => {
          studyCards = studyCards.concat(
            this.sortStudyCards(note.studyCards, note.studyCardOrder),
          );
        });
      }
      if (limit) studyCards = studyCards.slice(0, limit);

      const studyCardIds: number[] = studyCards.map((el) => el.id);

      const cardScores = await this.cardScores.find({
        where: {
          studyCard: In(studyCardIds),
          user: {
            id: user.id,
          },
        },
        relations: {
          studyCard: true,
        },
      });
      studyCards = studyCards
        .map((card) => ({
          ...card,
          myScore:
            cardScores.find((score) => score.studyCard.id === card.id)?.score ||
            null,
        }))
        .filter((card) => scores.length === 0 || scores.includes(card.myScore));
      return {
        ok: true,
        studyCards,
      };
    } catch {
      return {
        ok: false,
        error: '카드를 가져오는데 실패했습니다.',
      };
    }
  }

  sortStudyCards(
    studyCards: StudyCard[],
    studyCardOrder: number[],
  ): StudyCard[] {
    const cardMap = new Map<number, StudyCard>();
    studyCards.forEach((card) => {
      cardMap.set(card.id, card);
    });
    const sortedCards = studyCardOrder
      .map((id) => cardMap.get(id))
      .filter((card) => card !== undefined) as StudyCard[];
    return sortedCards;
  }
}
