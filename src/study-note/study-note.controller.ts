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
import { StudyNoteService } from './study-note.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateStudyNoteInput } from './dtos/create-study-note.dto';
import { GetStudyNotesInput } from './dtos/get-study-notes.dto';
import { UpdateStudyNoteInput } from './dtos/update-study-note.dto';
import { Role } from 'src/common/decorators/role.decorators';

@Controller('study-note')
export class StudyNoteController {
  constructor(private readonly studyNoteService: StudyNoteService) {}
  @Role(['any'])
  @Post()
  createStudyNote(
    @AuthUser() user: User,
    @Body() createStudyNoteInput: CreateStudyNoteInput,
  ) {
    return this.studyNoteService.createStudyNote(user, createStudyNoteInput);
  }

  @Role(['any'])
  @Get('')
  getMyStudyNotes(
    @AuthUser() user: User,
    @Query() getStudyNotesInput: GetStudyNotesInput,
  ) {
    return this.studyNoteService.getStudyNotes(user, getStudyNotesInput);
  }

  @Get(':id')
  getStudyNote(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) studyNoteId: string,
  ) {
    return this.studyNoteService.getStudyNote(user, +studyNoteId);
  }

  @Role(['any'])
  @Delete(':id')
  deleteStudyNote(@AuthUser() user: User, @Param('id') studyNoteId: string) {
    return this.studyNoteService.deleteStudyNote(user, +studyNoteId);
  }

  @Role(['any'])
  @Patch(':id')
  updateStudyNote(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) studyNoteId: string,
    @Body() updateStudyNoteInput: UpdateStudyNoteInput,
  ) {
    return this.studyNoteService.updateStudyNote(
      user,
      +studyNoteId,
      updateStudyNoteInput,
    );
  }
}
