import { Injectable } from '@nestjs/common';
import { UploadImageInput, UploadImageOutput } from './dtos/uploadImage.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}
  async uploadImage(
    uploadImageInput: UploadImageInput,
    file: Express.Multer.File,
  ): Promise<UploadImageOutput> {
    try {
      const { path } = uploadImageInput;
      const BUCKET_NAME = this.configService.get('AWS_BUCKET_NAME');
      AWS.config.update({
        credentials: {
          accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
          secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
        },
      });
      const objectName = `${path + '/' + Date.now() + '_' + uuidv4()}`;
      const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!fileTypes.includes(file.mimetype)) {
        return {
          ok: false,
          error: '올바른 파일 형식이 아닙니다.',
        };
      }
      if (file.size > 1024 * 1024) {
        return {
          ok: false,
          error: '1MB 이하의 파일만 업로드 가능합니다.',
        };
      }
      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();

      return {
        ok: true,
        url: `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not upload image',
      };
    }
  }
}
