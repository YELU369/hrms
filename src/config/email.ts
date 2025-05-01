import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export const emailconfig = {
  host: process.env.EMAIL_HOST || '',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_PASSWORD || ''
} as EmailConfig