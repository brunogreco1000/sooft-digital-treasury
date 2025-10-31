import { Controller, Post, Body, Res, Get, Req, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto.username, dto.password, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    return this.authService.me(req.user.sub);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Query('redirect') redirect: string) {
    // Passport redirige automáticamente a Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('redirect') redirect: string,
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('Google authentication failed');

    const token = this.authService.getJwtToken(user);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return res.redirect( `${process.env.FRONTEND_URL || 'http://localhost:3000'}${redirect || '/'}?google=success`);
  }
}
