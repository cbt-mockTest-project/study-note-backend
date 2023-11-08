import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async getAccessToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async getRefreshToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
