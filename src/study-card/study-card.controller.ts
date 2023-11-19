import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudyCardService } from './study-card.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateStudyCardInput } from './dtos/update-study-card.dto';
import { CreateStudyCardInput } from './dtos/create-study-card.dto';
import { Role } from 'src/common/decorators/role.decorators';
import { GetStudyCardsFromNoteIdsInput } from './dtos/get-study-cards-from-note-ids.dto';

@Controller('study-card')
export class StudyCardController {
  constructor(private readonly studyCardService: StudyCardService) {}

  @Role(['any'])
  @Delete(':id')
  deleteStudyNote(@AuthUser() user: User, @Param('id') studyNoteId: string) {
    return this.studyCardService.deleteStudyCard(user, +studyNoteId);
  }
  @Role(['any'])
  @Patch(':id')
  updateStudyCard(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) studyNoteId: string,
    @Body() updateStudyCardInput: UpdateStudyCardInput,
  ) {
    return this.studyCardService.updateStudyCard(
      user,
      +studyNoteId,
      updateStudyCardInput,
    );
  }

  @Role(['any'])
  @Post(':id')
  createStudyCard(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) studyNoteId: string,
    @Body() createStudyCardInput: CreateStudyCardInput,
  ) {
    return this.studyCardService.createStudyCard(
      user,
      +studyNoteId,
      createStudyCardInput,
    );
  }

  @Role(['any'])
  @Get('')
  getStudyCardsFromNoteIds(
    @AuthUser() user: User,
    @Query() getStudyCardsFromNoteIdsInput: GetStudyCardsFromNoteIdsInput,
  ) {
    return this.studyCardService.getStudyCardsFromNoteIds(
      user,
      getStudyCardsFromNoteIdsInput,
    );
  }
}
