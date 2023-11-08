import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AllowedRoles } from 'src/common/decorators/role.decorators';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  /** 비로그인 유저 - role이 지정되어 있지 않을 경우 통과
   *  로그인 유저 - ANY일경우 ADMIN, CLIENT 모두 통과
   *  로그인 유저 - 데코레이터에 명시한 Role과 자신의 Role이 일치 할 경우 통과
   */
  async canActivate(context: ExecutionContext) {
    try {
      // Metadata에 부여한 role
      const roles = this.reflector.get<AllowedRoles>(
        'roles',
        context.getHandler(),
      );
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      const token = authorization && authorization.split(' ')[1];
      if (token) {
        const decodedToken = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
        if (
          typeof decodedToken === 'object' &&
          decodedToken.hasOwnProperty('sub')
        ) {
          const { user } = await this.userService.findUser(decodedToken['sub']);
          if (user) {
            request.user = user;
          }
          if (roles) {
            // 로그인 유저 통과
            if (roles.includes('Any')) {
              return true;
            }
            return roles.includes(user.role);
          }
        }
      }
      // 비로그인 유저 통과
      if (!roles) {
        return true;
      }
      return false;
    } catch (error) {
      if (error.message === 'jwt expired') {
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
      throw new UnauthorizedException();
    }
  }
}
