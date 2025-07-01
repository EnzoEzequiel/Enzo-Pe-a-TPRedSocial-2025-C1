import * as jwt from 'jsonwebtoken';

export function extractUserFromHeader(authorization: string) {
  if (!authorization) return null;

  const token = authorization.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt') as any;
    return decoded;
  } catch (e) {
    console.warn('[extractUserFromHeader] Token inválido');
    return null;
  }
}
