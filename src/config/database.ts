interface DBConfig {
  type: string, 
  host: string, 
  port: number, 
  username: string, 
  password: string, 
  database: string, 
}

export const dbconfig = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
} as DBConfig