import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { StudyCardService } from './study-card.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UpdateStudyCardInput } from './dto/update-study-card.dto';
import { CreateStudyCardInput } from './dto/create-study-card.dto';
import { Role } from 'src/common/decorators/role.decorators';

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
  updateStudyNote(
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
  @Post('')
  createStudyNote(
    @AuthUser() user: User,
    @Body() createStudyCardInput: CreateStudyCardInput,
  ) {
    return this.studyCardService.createStudyCard(user, createStudyCardInput);
  }
}
