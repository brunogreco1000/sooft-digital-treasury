// backend/common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Ejecuta la lógica de AuthGuard 'jwt' estándar
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Lanza un error si no hay usuario
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }
}
