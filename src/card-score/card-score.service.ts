import { Injectable } from '@nestjs/common';
import { CardScore } from './entities/card-score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/user/entities/user.entity';
import { SaveCardScoreInput } from './dtos/save-card-score.dto';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { ResetCardScoreInput } from './dtos/reset-card-score.dto';

@Injectable()
export class CardScoreService {
  constructor(
    @InjectRepository(CardScore)
    private readonly cardScores: Repository<CardScore>,
    @InjectRepository(StudyCard)
    private readonly studyCards: Repository<StudyCard>,
  ) {}
  async saveCardScore(
    user: User,
    studyCardId: number,
    saveCardScoreInput: SaveCardScoreInput,
  ): Promise<CoreOutput> {
    try {
      const { score } = saveCardScoreInput;
      const studyCard = await this.studyCards.findOne({
        where: {
          id: studyCardId,
        },
      });
      if (!studyCard) {
        return {
          ok: false,
          error: '존재하지 않는 카드입니다.',
        };
      }
      const cardScore = await this.cardScores.findOne({
        where: {
          user: {
            id: user.id,
          },
          studyCard: {
            id: studyCardId,
          },
        },
      });
      if (cardScore) {
        await this.cardScores.save({
          ...cardScore,
          score,
        });
        return {
          ok: true,
        };
      }
      await this.cardScores.save(
        this.cardScores.create({
          user,
          studyCard,
          score,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '점수를 저장할 수 없습니다.',
      };
    }
  }
  async resetCardScore(
    user: User,
    resetCardScoreInput: ResetCardScoreInput,
  ): Promise<CoreOutput> {
    const { studyCardId } = resetCardScoreInput;
    const where: FindOptionsWhere<CardScore> = {
      user: {
        id: user.id,
      },
    };
    if (studyCardId) {
      where.studyCard = {
        id: studyCardId,
      };
    }
    try {
      await this.cardScores.delete(where);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '점수를 초기화할 수 없습니다.',
      };
    }
  }
}
