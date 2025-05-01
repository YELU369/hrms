import dotenv from 'dotenv';
import path from 'path';
import { Secret } from 'jsonwebtoken';

dotenv.config({ path: path.join(__dirname, '../.env') });

interface JWTConfig {
  secret: Secret, 
  expiresIn: string | number, 
}

export const jwtconfig = {
  secret: (process.env.JWT_SECRET || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6') as Secret,
  expiresIn: process.env.JWT_EXPIRES_IN || '1h'
} as JWTConfig