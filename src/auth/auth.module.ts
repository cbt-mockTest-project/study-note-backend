import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from 'src/auth/token.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    JwtService,
    UserService,
    TokenService,
  ],
})
export class AuthModule {}
