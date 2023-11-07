import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudyCardService } from './study-card.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateStudyCardInput } from './dto/update-study-card.dto';
import { CreateStudyCardInput } from './dto/create-study-card.dto';

@Controller('study-card')
export class StudyCardController {
  constructor(private readonly studyCardService: StudyCardService) {}

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteStudyNote(@AuthUser() user: User, @Param('id') studyNoteId: string) {
    return this.studyCardService.deleteStudyCard(user, +studyNoteId);
  }

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Post('')
  createStudyNote(
    @AuthUser() user: User,
    @Body() createStudyCardInput: CreateStudyCardInput,
  ) {
    return this.studyCardService.createStudyCard(user, createStudyCardInput);
  }
}
