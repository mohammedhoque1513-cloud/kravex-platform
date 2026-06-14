import Redis from "ioredis";

let redis: Redis | null = null;
const memory = new Map<string, { value: string; expiresAt: number | null }>();

export function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  }
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (client) {
    const value = await client.get(key);
    return value ? JSON.parse(value) as T : null;
  }
  const stored = memory.get(key);
  if (!stored) return null;
  if (stored.expiresAt && stored.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }
  return JSON.parse(stored.value) as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300) {
  const client = getRedis();
  const encoded = JSON.stringify(value);
  if (client) {
    await client.set(key, encoded, "EX", ttlSeconds);
    return;
  }
  memory.set(key, { value: encoded, expiresAt: Date.now() + ttlSeconds * 1000 });
}
