import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: [], // Quiet error logs during fallback offline mode
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

let isDbConnected = false;

export async function checkDbConnection(): Promise<boolean> {
  if (
    !env.DATABASE_URL ||
    env.DATABASE_URL.includes('username:password') ||
    env.DATABASE_URL.includes('database_name')
  ) {
    return false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    if (!isDbConnected) {
      console.log('[Prisma DB] Connected successfully to PostgreSQL database');
      isDbConnected = true;
    }
    return true;
  } catch (err: any) {
    if (isDbConnected) {
      console.warn('[Prisma DB] PostgreSQL connection lost. Falling back to safe mode.');
      isDbConnected = false;
    }
    return false;
  }
}
