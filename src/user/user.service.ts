import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserInput, UpdateUserOutput } from './dtos/update-user.dto';
import { Response, Request } from 'express';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginType, User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from '../auth/token.service';
import { parseCookies, setLoginCookie } from 'src/lib/util';
import { MeOutput } from './dtos/me.dto';
import { ConfigService } from '@nestjs/config';
import { FindUserOutput } from './dtos/find-user.dto';
import {
  RefreshAuthTokenInput,
  RefreshAuthTokenOutput,
} from './dtos/refresh-auth-token.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  async me(user: User, ip?: string): Promise<MeOutput> {
    try {
      await this.updateUser(user.id, { lastLogInIp: ip });
      return {
        ok: true,
        user,
      };
    } catch {
      return {
        ok: false,
        error: '유저 정보를 가져오는데 실패했습니다.',
      };
    }
  }

  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const foundUser = await this.users.findOne({
        where: [
          {
            email: createUserInput.email,
          },
          { nickname: createUserInput.nickname },
        ],
      });
      if (foundUser) {
        if (foundUser.email === createUserInput.email) {
          return {
            ok: false,
            error: '이미 존재하는 이메일입니다.',
          };
        }
        if (foundUser.nickname === createUserInput.nickname) {
          createUserInput.nickname = `${
            createUserInput.nickname
          }#${uuidv4().slice(0, 5)}`;
        }
      }
      const user = await this.users.save(this.users.create(createUserInput));
      return {
        ok: true,
        id: user.id,
      };
    } catch (e) {
      return {
        ok: false,
        error: '계정 생성에 실패했습니다.',
      };
    }
  }

  async updateUser(
    id: number,
    updateUserInpt: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      const { nickname, picture, refreshToken } = updateUserInpt;
      const updateData: UpdateUserInput = {};
      if (nickname) {
        const existUser = await this.users.findOne({
          where: {
            nickname,
          },
        });
        if (existUser) {
          return {
            ok: false,
            error: '이미 존재하는 닉네임입니다.',
          };
        }
        updateData.nickname = nickname;
      }
      if (picture) {
        updateData.picture = picture;
      }
      if (refreshToken) {
        updateData.refreshToken = refreshToken;
      }
      await this.users.update(id, updateData);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '계정 업데이트에 실패했습니다.',
      };
    }
  }

  async deleteUser(id: number) {
    try {
      await this.users.delete(id);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '계정 삭제에 실패했습니다.',
      };
    }
  }

  async findUser(id: number): Promise<FindUserOutput> {
    try {
      const user = await this.users.findOne({
        where: { id },
      });
      if (!user) {
        return {
          ok: false,
          error: '유저를 찾을 수 없습니다.',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch {
      return {
        ok: false,
        error: '유저를 찾을 수 없습니다.',
      };
    }
  }

  async refreshAuthToken(
    res: Response,
    refreshAuthTokenInput: RefreshAuthTokenInput,
  ): Promise<RefreshAuthTokenOutput> {
    try {
      const { refreshToken } = refreshAuthTokenInput;
      const user = await this.users.findOne({
        where: {
          refreshToken,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: '토큰을 찾을 수 없습니다.',
        };
      }
      const accessToken = await this.tokenService.getAccessToken(user.id);
      const newRefreshToken = await this.tokenService.getRefreshToken(user.id);
      await this.updateUser(user.id, { refreshToken: newRefreshToken });
      setLoginCookie(res, accessToken, newRefreshToken);
      return {
        ok: true,
        accessToken,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유저를 찾을 수 없습니다.',
      };
    }
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const code = req.url.split('code=').at(-1).split('&').at(0);
      const {
        data: { access_token },
      } = await axios.post(
        `https://oauth2.googleapis.com/token?code=${code}&client_id=${this.configService.get(
          'GOOGLE_CLIENT_ID',
        )}&client_secret=${this.configService.get(
          'GOOGLE_SECRET_KEY',
        )}&redirect_uri=${this.configService.get(
          'GOOGLE_REDIRECT_URI',
        )}&grant_type=authorization_code`,
        {},
        {
          headers: {
            'content-type': 'x-www-form-urlencoded',
          },
        },
      );
      if (!access_token) {
        throw new UnauthorizedException('No data from google');
      }
      const { data: userData } = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      if (!userData) {
        throw new UnauthorizedException('No data from google');
      }
      const { email, picture, name } = userData;
      const user = await this.users.findOne({
        where: {
          email,
        },
      });
      let userId: number;
      if (!user) {
        const res = await this.createUser({
          email,
          picture,
          nickname: name,
          loginType: LoginType.GOOGLE,
        });
        if (res.error) {
          return {
            ok: false,
            error: res.error,
          };
        }
        userId = res.id;
      } else {
        userId = user.id;
      }

      const accessToken = await this.tokenService.getAccessToken(userId);
      const refreshToken = await this.tokenService.getRefreshToken(userId);
      await this.updateUser(userId, { refreshToken });
      setLoginCookie(res, accessToken, refreshToken);
      res.redirect(
        `${this.configService.get('FRONTEND_URL')}${cookies.redirect || '/'}`,
      );
    } catch (e) {
      return {
        ok: false,
        error: '로그인에 실패했습니다.',
      };
    }
  }

  async kakaoLogin(req: Request, res: Response) {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const code = req.url.split('code=').at(-1).split('&').at(0);
      const {
        data: { access_token },
      } = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.configService.get('KAKAO_REST_API_KEY'),
          redirect_uri: this.configService.get('KAKAO_REDIRECT_URI'),
          code,
        },
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      if (!access_token) {
        throw new UnauthorizedException('No data from kakao');
      }
      const { data: userData } = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      if (!userData) {
        throw new UnauthorizedException('No data from kakao');
      }
      const { email, profile } = userData.kakao_account;
      const user = await this.users.findOne({
        where: {
          email,
        },
      });
      let userId: number;
      if (!user) {
        const res = await this.createUser({
          email,
          picture: profile.profile_image_url,
          nickname: profile.nickname,
          loginType: LoginType.KAKAO,
        });
        if (res.error) {
          return {
            ok: false,
            error: res.error,
          };
        }
        userId = res.id;
      } else {
        userId = user.id;
      }

      const accessToken = await this.tokenService.getAccessToken(userId);
      const refreshToken = await this.tokenService.getRefreshToken(userId);
      await this.updateUser(userId, { refreshToken });
      setLoginCookie(res, accessToken, refreshToken);
      res.redirect(
        `${this.configService.get('FRONTEND_URL')}${cookies.redirect || '/'}`,
      );
    } catch (e) {
      return {
        ok: false,
        error: '로그인에 실패했습니다.',
      };
    }
  }
  async logout(res: Response) {
    res.clearCookie('refreshToken', {
      domain: this.configService.get('FRONTEND_DOMAIN'),
      path: '/',
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    res.clearCookie('accessToken', {
      domain: this.configService.get('FRONTEND_DOMAIN'),
      path: '/',
      sameSite: 'none',
      secure: true,
      httpOnly: false,
    });
    res.sendStatus(200);
  }
}
