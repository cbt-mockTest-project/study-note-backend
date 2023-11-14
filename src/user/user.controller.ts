import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Res,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dtos/create-user.dto';
import { UpdateUserInput } from './dtos/update-user.dto';
import { ProxyIp } from 'src/common/decorators/ip.decorator';
import { Request, Response } from 'express';
import { RefreshAuthTokenInput } from './dtos/refresh-auth-token.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { Role } from 'src/common/decorators/role.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserInput) {
    return this.userService.createUser(createUserDto);
  }

  @Role(['any'])
  @Patch('')
  update(@AuthUser() user: User, @Body() updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(user.id, updateUserInput);
  }

  @Role(['any'])
  @Delete('')
  delete(@AuthUser() user: User) {
    return this.userService.deleteUser(user.id);
  }

  @Role(['any'])
  @Get('me')
  async me(@AuthUser() user: User, @ProxyIp() ip?: string) {
    return this.userService.me(user, ip);
  }

  @Get('login/google')
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    return this.userService.googleLogin(req, res);
  }

  @Get('login/kakao')
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    return this.userService.kakaoLogin(req, res);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findUser(+id);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return this.userService.logout(res);
  }

  @Post('refresh')
  refresh(
    @Res() res: Response,
    @Body('refreshToken') refreshAuthTokenInput: RefreshAuthTokenInput,
  ) {
    return this.userService.refreshAuthToken(res, refreshAuthTokenInput);
  }
}
