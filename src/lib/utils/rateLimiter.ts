/**
 * Client-side rate limiter using localStorage timestamps.
 * Prevents spam submissions from the browser side.
 *
 * Usage:
 *   const { allowed, secondsRemaining } = checkRateLimit("form_submit", 30_000, 1);
 *   if (!allowed) { ... }
 */
export interface RateLimitResult {
  /** Whether the action is allowed to proceed */
  allowed: boolean;
  /** Seconds remaining until the next attempt is allowed (0 if allowed) */
  secondsRemaining: number;
}

export function checkRateLimit(
  key: string,
  windowMs: number = 30_000,
  maxRequests: number = 1
): RateLimitResult {
  if (typeof window === "undefined") {
    return { allowed: true, secondsRemaining: 0 };
  }

  const storageKey = `bravo_rl_${key}`;
  const now = Date.now();

  try {
    const raw = localStorage.getItem(storageKey);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];

    // Filter timestamps within the window
    const recent = timestamps.filter((ts) => now - ts < windowMs);

    if (recent.length >= maxRequests) {
      const oldest = Math.min(...recent);
      const nextAllowed = oldest + windowMs;
      const secondsRemaining = Math.ceil((nextAllowed - now) / 1000);
      return { allowed: false, secondsRemaining: Math.max(0, secondsRemaining) };
    }

    // Record this attempt
    const updated = [...recent, now].slice(-100); // cap at 100
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return { allowed: true, secondsRemaining: 0 };
  } catch {
    // If localStorage fails, allow the action
    return { allowed: true, secondsRemaining: 0 };
  }
}

/**
 * Clear the rate limit for a given key (e.g., after a successful submission).
 */
export function clearRateLimit(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`bravo_rl_${key}`);
  } catch {
    // ignore
  }
}
