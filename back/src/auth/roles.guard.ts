import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    console.log('[RolesGuard] FULL REQUEST:', JSON.stringify({
      headers: req.headers,
      user: req.user,
      body: req.body,
      url: req.url,
      method: req.method
    }, null, 2));
    const { user } = req;
    console.log('[RolesGuard] user:', user);
    if (!user || !requiredRoles.includes(user.role)) {
      console.warn('[RolesGuard] Forbidden: user or role mismatch', { user, requiredRoles });
      throw new ForbiddenException('You do not have permission (roles)');
    }
    return true;
  }
}
