/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window counter approach.
 */

const rateLimitStore = new Map();

/**
 * Clean up expired entries periodically to prevent memory leaks.
 */
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit a request.
 * @param {string} identifier - Unique identifier (e.g., IP address or API key)
 * @param {object} options - Rate limit options
 * @param {number} options.maxRequests - Maximum number of requests allowed in the window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function rateLimit(identifier, { maxRequests = 60, windowMs = 60_000 } = {}) {
  cleanup();

  const now = Date.now();
  const key = `rl:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Increment counter
  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

/**
 * Get client IP address from request headers.
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers?.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers?.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Create a rate-limited handler for Next.js API routes.
 * @param {Function} handler - The API route handler
 * @param {object} options - Rate limit options
 * @returns {Function} Wrapped handler with rate limiting
 */
export function withRateLimit(handler, options = {}) {
  const { maxRequests = 60, windowMs = 60_000, keyPrefix = "" } = options;

  return async function rateLimitedHandler(request, context) {
    const ip = getClientIp(request);
    const key = `${keyPrefix}${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(key, { maxRequests, windowMs });

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
          },
        }
      );
    }

    const response = await handler(request, context);

    // Add rate limit headers to successful responses
    if (response instanceof Response) {
      response.headers.set("X-RateLimit-Limit", String(maxRequests));
      response.headers.set("X-RateLimit-Remaining", String(remaining));
    }

    return response;
  };
}