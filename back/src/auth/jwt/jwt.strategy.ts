import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // secretOrKey: 'mi_clave_secreta',
            secretOrKey: process.env.JWT_SECRET || 'jwt',
        });
    }

    async validate(payload: any) {
        console.log('[JwtStrategy] payload:', payload);
        return {
            _id: payload.sub, 
            username: payload.username,
            email: payload.email,
            role: payload.role,
        };
    }
}
