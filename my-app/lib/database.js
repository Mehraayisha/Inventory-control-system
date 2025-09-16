import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'inventory_db',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 5432,
    });
  }
  return pool;
}