import Redis from 'ioredis';
import { env } from './env.js';

let redisClient: Redis | null = null;

try {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 200, 1000);
    },
  });

  redisClient.on('error', (err) => {
    // Silent catch so missing Redis doesn't crash the server
  });
} catch (err) {
  console.warn('[Redis] Redis client initialization skipped or offline');
}

export { redisClient };
