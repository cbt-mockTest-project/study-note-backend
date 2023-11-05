import {
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      if (error.status === 403) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const refreshToken = request.headers.cookie.split('=')[1].split(';')[0];
        if (!refreshToken) {
          throw new UnauthorizedException('No refresh token');
        }
        const res = await this.userService.refreshAuthToken(
          response,
          refreshToken,
        );
        if (res.ok) {
          request.user = res.user;
        }
        return true;
      }
      throw error;
    }
  }

  handleRequest(err, user, info) {
    if (info && info.name === 'TokenExpiredError') {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: 'Access token has expired',
      });
    }
    if (err || !user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: err ? err.message : 'No user',
      });
    }
    return user;
  }
}
