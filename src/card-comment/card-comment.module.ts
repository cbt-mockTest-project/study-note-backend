import { Module } from '@nestjs/common';
import { CardCommentService } from './card-comment.service';
import { CardCommentController } from './card-comment.controller';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { CardComment } from './entites/card-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StudyCard, CardComment])],
  providers: [CardCommentService],
  controllers: [CardCommentController],
})
export class CardCommentModule {}
