interface CachedSuggestions {
  aspects: string[];
  timestamp: number;
}

const cache = new Map<string, CachedSuggestions>();
const TTL_MS = 15 * 60 * 1000; // 15 minutes

export function cacheAspectSuggestions(interactionId: string, aspects: string[]): void {
  cache.set(interactionId, { aspects, timestamp: Date.now() });
}

export function getCachedAspect(interactionId: string, index: number): string | null {
  const entry = cache.get(interactionId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(interactionId);
    return null;
  }
  return entry.aspects[index] ?? null;
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
