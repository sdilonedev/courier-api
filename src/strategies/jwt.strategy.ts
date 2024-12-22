import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '@/config/config';
import { Payload } from '@/interfaces/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.accessSecretKey,
    });
  }

  async validate(payload: Payload) {
    return { userId: payload.sub, username: payload.username };
  }
}
