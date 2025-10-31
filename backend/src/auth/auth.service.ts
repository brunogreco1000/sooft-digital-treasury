import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const user = await this.usersService.create(username, email, password);
    return { message: 'Usuario registrado', user };
  }

  async login(usernameOrEmail: string, password: string, res: Response) {
    const user = await this.usersService.findByEmailOrUsername(usernameOrEmail);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña incorrecta');

    const token = this.getJwtToken(user);

    // Configuración de cookie adaptable a entorno
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return { user: { id: user._id, username: user.username, email: user.email } };
  }

  async logout(res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: 'Sesión cerrada' };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return { user };
  }

  // ----------------------
  // Helper para generar JWT
  // ----------------------
  getJwtToken(user: any): string {
    const payload = { sub: user._id || user.sub, username: user.username, email: user.email };
    return this.jwtService.sign(payload);
  }
}
