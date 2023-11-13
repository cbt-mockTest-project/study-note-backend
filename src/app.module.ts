import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FolderModule } from './folder/folder.module';
import { StudyNoteModule } from './study-note/study-note.module';
import { StudyCardModule } from './study-card/study-card.module';
import { FolderBookmarkModule } from './folder-bookmark/folder-bookmark.module';
import { FolderLikeModule } from './folder-like/folder-like.module';
import { AuthModule } from './auth/auth.module';
import { CardScoreModule } from './card-score/card-score.module';
import { FolderReadAccessModule } from './folder-read-access/folder-read-access.module';
import { FolderEditAccessModule } from './folder-edit-access/folder-edit-access.module';
import { CardCommentModule } from './card-comment/card-comment.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    UserModule,
    FolderModule,
    StudyNoteModule,
    StudyCardModule,
    FolderBookmarkModule,
    FolderLikeModule,
    AuthModule,
    CardScoreModule,
    FolderReadAccessModule,
    FolderEditAccessModule,
    CardCommentModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
