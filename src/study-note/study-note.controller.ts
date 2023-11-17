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
import { SaveStudyNoteInput } from './dtos/save-study-note.dto';
import { GetStudyNotesInput } from './dtos/get-study-notes.dto';
import { UpdateStudyNoteInput } from './dtos/update-study-note.dto';
import { Role } from 'src/common/decorators/role.decorators';
import {
  AddStudyNoteToFolderInput,
  AddStudyNoteToFolderOutput,
} from './dtos/add-study-note-to-folder.dto';
import {
  RemoveStudyNoteFromFolderInput,
  RemoveStudyNoteFromFolderOutput,
} from './dtos/remove-study-note-from-folder';

@Controller('study-note')
export class StudyNoteController {
  constructor(private readonly studyNoteService: StudyNoteService) {}
  @Role(['any'])
  @Post('')
  createStudyNote(
    @AuthUser() user: User,
    @Body() createStudyNoteInput: SaveStudyNoteInput,
  ) {
    return this.studyNoteService.saveStudyNote(user, createStudyNoteInput);
  }

  @Role(['any'])
  @Get('')
  getStudyNotes(
    @AuthUser() user: User,
    @Query() getStudyNotesInput: GetStudyNotesInput,
  ) {
    return this.studyNoteService.getStudyNotes(user, getStudyNotesInput);
  }

  @Role(['any'])
  @Get('edit/:id')
  getStudyNoteForEdit(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studyNoteService.getStudyNoteForEdit(user, +id);
  }

  @Role(['any'])
  @Get('me')
  getMyStudyNotes(@AuthUser() user: User) {
    return this.studyNoteService.getMyStudyNotes(user);
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

  @Role(['any'])
  @Post('/add-to-folder')
  addStudyNoteToFolder(
    @AuthUser() user: User,
    @Body() addStudyNoteToFolderInput: AddStudyNoteToFolderInput,
  ): Promise<AddStudyNoteToFolderOutput> {
    return this.studyNoteService.addStudyNoteToFolder(
      user,
      addStudyNoteToFolderInput,
    );
  }

  @Role(['any'])
  @Post('/remove-from-folder')
  removeStudyNoteFromFolder(
    @AuthUser() user: User,
    @Body() removeStudyNoteFromFolderInput: RemoveStudyNoteFromFolderInput,
  ): Promise<RemoveStudyNoteFromFolderOutput> {
    return this.studyNoteService.removeStudyNoteFromFolder(
      user,
      removeStudyNoteFromFolderInput,
    );
  }
}
