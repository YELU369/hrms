import { jwtconfig } from '@/config/jwt';
import { AppDataSource } from '@/data-source';
import { BlacklistedToken } from '@/entity/BlacklistedToken';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user_id?: number;
}

export const validateToken = async (request: AuthRequest, response: Response, next: NextFunction) => {

  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    response.status(401).json({ message: 'Authentication token required!' });
    return;
  }

  const isBlacklisted = await AppDataSource.getRepository(BlacklistedToken).findOne({ where: { token: token } });
  if (isBlacklisted) {
    response.status(403).json({ message: 'Invalid token!' });
    return;
  }

  try {

    const decoded: any = jwt.verify(token, jwtconfig.secret);
    request.user_id = decoded.user_id;
    next();

  } catch (error) {
    
    response.status(401).json({
      success: false,
      message: 'TOKEN_INVALID',
      data: null,
    });
  }
}