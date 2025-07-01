import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    console.log('[JwtAuthGuard] Authorization header:', authHeader);

    const result = (await super.canActivate(context)) as boolean;

    console.log('[JwtAuthGuard] req.user luego del canActivate AAAAAAAAAAAAAA:', req.user);
    console.log('[JwtAuthGuard] ¿req.user existe?', req.user);

    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.warn('[JwtAuthGuard] Error o usuario no válido:', err, info);
      throw err || new UnauthorizedException();
    }
    console.log('[JwtAuthGuard] Usuario validado:', user);
    return user;
  }
}
