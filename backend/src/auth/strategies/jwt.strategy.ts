import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) throw new Error('JWT_SECRET no definido');

    super({
      jwtFromRequest: (req: Request) => req?.cookies?.token,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true, // ✅ importante para recibir Request
    } as StrategyOptionsWithRequest); // forzamos el tipo correcto
  }

  async validate(req: Request, payload: any) {
    // payload viene del JWT
    return { sub: payload.sub, username: payload.username, email: payload.email };
  }
}
