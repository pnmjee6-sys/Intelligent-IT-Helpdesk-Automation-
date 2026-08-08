import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

// Initialize PostgreSQL pool with standard pg settings
export const dbPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

let isDbConnected = false;

dbPool.on('connect', () => {
  if (!isDbConnected) {
    console.log('[Database] PostgreSQL connection pool initialized');
    isDbConnected = true;
  }
});

dbPool.on('error', (err) => {
  console.warn('[Database] Unexpected PostgreSQL pool error:', err.message);
});

export async function checkDbConnection(): Promise<boolean> {
  try {
    const client = await dbPool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    return !!res.rows[0];
  } catch (err) {
    console.warn('[Database] PostgreSQL connection unavailable. Safe fallback mode active.');
    return false;
  }
}
