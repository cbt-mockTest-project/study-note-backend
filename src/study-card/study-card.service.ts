import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  CreateStudyCardOutput,
  CreateStudyCardInput,
} from './dto/create-study-card.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudyCard } from './entities/study-card.entity';
import { StudyNote } from 'src/study-note/entities/study-note.entity';
import {
  UpdateStudyCardInput,
  UpdateStudyCardOutput,
} from './dto/update-study-card.dto';

@Injectable()
export class StudyCardService {
  constructor(
    @InjectRepository(StudyNote)
    private readonly studyNotes: Repository<StudyNote>,
    @InjectRepository(StudyCard)
    private readonly studyCards: Repository<StudyCard>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async createStudyCard(
    user: User,
    createStudyCardInput: CreateStudyCardInput,
  ): Promise<CreateStudyCardOutput> {
    try {
      const { question, question_img, answer, answer_img, studyNoteId } =
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
      const studyCard = await this.studyCards.save(
        this.studyCards.create({
          question,
          question_img,
          answer,
          answer_img,
          studyNote,
          user,
        }),
      );

      return {
        studyCard,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '카드를 생성하는데 실패했습니다.',
      };
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
}
