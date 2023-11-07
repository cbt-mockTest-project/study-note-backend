import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ProxyIp } from 'src/common/decorators/ip.decorator';
import { Request, Response } from 'express';
import { RefreshAuthTokenInput } from './dto/refresh-auth-token.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserInput) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(+id, updateUserInput);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@AuthUser() user: User, @ProxyIp() ip?: string) {
    return this.userService.me(user, ip);
  }

  @Get('login/google')
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    return this.userService.googleLogin(req, res);
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
