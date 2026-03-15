import { randomUUID } from 'node:crypto';

interface CachedContent {
  title: string;
  content: string;
  userId: string;
  timestamp: number;
}

const cache = new Map<string, CachedContent>();
const TTL_MS = 15 * 60 * 1000; // 15 minutes

export function cacheForShare(title: string, content: string, userId: string): string {
  const id = randomUUID();
  cache.set(id, { title, content, userId, timestamp: Date.now() });
  return `share_${id}`;
}

export function getSharedContent(customId: string): CachedContent | null {
  const id = customId.replace('share_', '');
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(id);
    return null;
  }
  return entry;
}

export function consumeSharedContent(customId: string): CachedContent | null {
  const entry = getSharedContent(customId);
  if (entry) {
    cache.delete(customId.replace('share_', ''));
  }
  return entry;
}

// Sweep expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.timestamp > TTL_MS) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();
