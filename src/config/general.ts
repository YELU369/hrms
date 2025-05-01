import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

interface GeneralConfig {
  port: number, 
  saltRounds: number, 
  verify_url: string, 
  reset_url: string
}

const port = parseInt(process.env.APP_PORT || '80', 10);

export const generalconfig = {
  port: port, 
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10), 
  verify_url: port? `${process.env.APP_URL}:${port}/verify` : `${process.env.APP_URL}/verify`, 
  reset_url: port? `${process.env.APP_URL}:${port}/reset-password` : `${process.env.APP_URL}/reset`
} as GeneralConfig