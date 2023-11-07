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
  UseGuards,
} from '@nestjs/common';
import { StudyNoteService } from './study-note.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateStudyNoteInput } from './dto/create-study-note.dto';
import { GetStudyNotesInput } from './dto/get-study-notes.dto';
import { UpdateStudyNoteInput } from './dto/update-study-note.dto';

@Controller('study-note')
export class StudyNoteController {
  constructor(private readonly studyNoteService: StudyNoteService) {}
  @UseGuards(JwtGuard)
  @Post()
  createStudyNote(
    @AuthUser() user: User,
    @Body() createStudyNoteInput: CreateStudyNoteInput,
  ) {
    return this.studyNoteService.createStudyNote(user, createStudyNoteInput);
  }

  @UseGuards(JwtGuard)
  @Get('')
  getMyStudyNotes(
    @AuthUser() user: User,
    @Query() getStudyNotesInput: GetStudyNotesInput,
  ) {
    return this.studyNoteService.getStudyNotes(user, getStudyNotesInput);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteStudyNote(@AuthUser() user: User, @Param('id') studyNoteId: string) {
    return this.studyNoteService.deleteStudyNote(user, +studyNoteId);
  }

  @UseGuards(JwtGuard)
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
