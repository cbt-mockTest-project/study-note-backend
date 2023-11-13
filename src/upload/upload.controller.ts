import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadImageInput } from './dtos/uploadImage.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body() uploadImageInput: UploadImageInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(uploadImageInput, file);
  }
}
