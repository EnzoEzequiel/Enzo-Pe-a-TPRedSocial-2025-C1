import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    console.log('[JwtAuthGuard] Authorization header:', authHeader);
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      console.warn('[JwtAuthGuard] Error o usuario no válido:', err, info);
    } else {
      console.log('[JwtAuthGuard] Usuario validado:', user);
    }
    return super.handleRequest(err, user, info, context);
  }
}
