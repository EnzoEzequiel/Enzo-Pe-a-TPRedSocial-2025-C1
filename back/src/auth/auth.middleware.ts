import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'jwt') as any;
       
        req.user = {
          _id: payload.sub,
          username: payload.username,
          email: payload.email,
          role: payload.role,
        };
      } catch {
        console.warn('[AuthMiddleware] Token inválido o expirado');
        req.user = null; 
      }
    }
    next();
  }
}
