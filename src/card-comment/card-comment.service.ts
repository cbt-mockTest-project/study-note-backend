import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { Repository } from 'typeorm';
import { CardComment } from './entites/card-comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  CreateCardCommentInput,
  CreateCardCommentOutput,
} from './dtos/createCardComment.dto';
import { UpdateCardCommentInput } from './dtos/updateCardComment';
import { CoreOutput } from 'src/common/dtos/output.dto';

@Injectable()
export class CardCommentService {
  constructor(
    @InjectRepository(StudyCard)
    private readonly studyCards: Repository<StudyCard>,
    @InjectRepository(CardComment)
    private readonly cardComments: Repository<CardComment>,
  ) {}

  async createCardComment(
    user: User,
    cardId: number,
    createCardCommentInput: CreateCardCommentInput,
  ): Promise<CreateCardCommentOutput> {
    try {
      const { comment } = createCardCommentInput;
      const studyCard = await this.studyCards.findOne({
        where: {
          id: cardId,
        },
      });
      if (!studyCard) {
        return {
          ok: false,
          error: '카드를 찾을 수 없습니다.',
        };
      }
      const cardComment = await this.cardComments.save(
        this.cardComments.create({
          comment,
          card: studyCard,
          user,
        }),
      );
      return {
        ok: true,
        cardComment,
      };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 생성할 수 없습니다.',
      };
    }
  }

  async updateCardComment(
    user: User,
    commentId: number,
    updateCardCommentInput: UpdateCardCommentInput,
  ): Promise<CoreOutput> {
    try {
      const { comment } = updateCardCommentInput;
      const cardComment = await this.cardComments.findOne({
        where: {
          id: commentId,
          user: {
            id: user.id,
          },
        },
      });
      if (!cardComment) {
        return {
          ok: false,
          error: '댓글을 찾을 수 없습니다.',
        };
      }
      cardComment.comment = comment;
      await this.cardComments.save(cardComment);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 수정할 수 없습니다.',
      };
    }
  }

  async deleteCardComment(user: User, commentId: number): Promise<CoreOutput> {
    try {
      const cardComment = await this.cardComments.findOne({
        where: {
          id: commentId,
          user: {
            id: user.id,
          },
        },
      });
      if (!cardComment) {
        return {
          ok: false,
          error: '댓글을 찾을 수 없습니다.',
        };
      }
      await this.cardComments.delete(cardComment.id);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 삭제할 수 없습니다.',
      };
    }
  }
}
