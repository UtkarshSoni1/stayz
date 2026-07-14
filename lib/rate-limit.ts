/**
 * lib/rate-limit.ts
 *
 * In-memory IP rate limiter using an LRU Map strategy.
 * Designed to prevent email bombing and abuse on registration endpoints.
 * 
 * Note: In a true distributed or serverless environment, this is per-instance.
 * For global consistency, this interface can be easily swapped for an Upstash Redis implementation.
 */

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitTracker>();

// Clean up expired entries every few minutes to prevent memory leaks in long-running processes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, tracker] of rateLimits.entries()) {
      if (now > tracker.resetAt) {
        rateLimits.delete(ip);
      }
    }
  }, 5 * 60 * 1000); // Clean up every 5 minutes
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60 * 60 * 1000 // default 1 hour
): RateLimitResult {
  const now = Date.now();
  let tracker = rateLimits.get(ip);

  if (!tracker || now > tracker.resetAt) {
    // First request or window expired
    tracker = { count: 1, resetAt: now + windowMs };
    rateLimits.set(ip, tracker);
    
    // Prevent the map from growing indefinitely if no interval cleanup runs (e.g., edge runtimes)
    if (rateLimits.size > 10000) {
      // Very crude eviction: clear the map if it gets too large
      rateLimits.clear();
      rateLimits.set(ip, tracker);
    }

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: tracker.resetAt,
    };
  }

  tracker.count += 1;

  if (tracker.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: tracker.resetAt,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - tracker.count,
    reset: tracker.resetAt,
  };
}
