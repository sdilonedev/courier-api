import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import config from '@/config/config';
import { ConfigType } from '@nestjs/config';
import { compare } from 'bcrypt';
import { User } from '@/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  generateAccessToken(user: User) {
    return this.jwtService.sign(user, {
      secret: this.configService.accessSecretKey,
      expiresIn: '15m',
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.sign(user, {
      secret: this.configService.refreshSecretKey,
      expiresIn: '7d',
    });
  }

  generateJwtPaylad(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateTokenByRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.refreshSecretKey,
      });
      const user = await this.usersService.findById(payload.sub);
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
