import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ProxyIp } from 'src/common/decorators/ip.decorator';
import { AuthRequest } from './interface/auth.interface';
import { Request, Response } from 'express';
import { RefreshAuthTokenInput } from './dto/refresh-auth-token.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserInput) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(+id, updateUserInput);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: AuthRequest, @ProxyIp() ip?: string) {
    return this.userService.me(req, ip);
  }

  @Get('login/google')
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    return this.userService.googleLogin(req, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUser(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('refresh')
  refresh(
    @Res() res: Response,
    @Body('refreshToken') refreshAuthTokenInput: RefreshAuthTokenInput,
  ) {
    return this.userService.refreshAuthToken(res, refreshAuthTokenInput);
  }
}
