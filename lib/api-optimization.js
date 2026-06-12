/**
 * Rate Limiting and API Protection for High-Traffic Applications
 * Prevents abuse and ensures fair resource distribution
 */

const rateLimitStore = new Map();

/**
 * Simple rate limiter using token bucket algorithm
 * @param {string} identifier - IP address or user ID
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
export const checkRateLimit = (identifier, maxRequests = 100, windowMs = 60 * 1000) => {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let record = rateLimitStore.get(key);
  
  // Initialize or reset if window expired
  if (!record || now - record.windowStart > windowMs) {
    record = {
      count: 0,
      windowStart: now,
    };
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  
  // Clean up old entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupRateLimit();
  }
  
  return {
    remaining: Math.max(0, maxRequests - record.count),
    limit: maxRequests,
    resetTime: record.windowStart + windowMs,
    isLimited: record.count > maxRequests,
  };
};

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimit() {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.windowStart > maxAge) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * API response cache key builder
 */
export const getCacheKey = (route, params = {}) => {
  const paramString = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return `api:${route}:${paramString}`;
};

/**
 * Optimize API response headers for high traffic
 */
export const getOptimalCacheHeaders = (cacheType = 'default') => {
  const headers = {
    // Static assets - aggressive caching
    static: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'max-age=31536000',
    },
    // API data - moderate caching
    api: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      'CDN-Cache-Control': 'max-age=86400',
    },
    // Product/Blog data - short caching
    content: {
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'max-age=3600',
    },
    // Dynamic content - minimal caching
    dynamic: {
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
      'CDN-Cache-Control': 'max-age=600',
    },
    // Default
    default: {
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'max-age=3600',
    },
  };
  
  return headers[cacheType] || headers.default;
};

/**
 * Get client IP from request
 */
export const getClientIP = (request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(';')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
};

/**
 * Create optimized API response
 */
export const createOptimalResponse = (data, options = {}) => {
  const {
    cacheType = 'default',
    status = 200,
    compress = true,
    includeMetadata = false,
  } = options;

  const headers = {
    ...getOptimalCacheHeaders(cacheType),
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  const response = {
    data,
    ...(includeMetadata && {
      timestamp: new Date().toISOString(),
      cached: false,
    }),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers,
  });
};

export default {
  checkRateLimit,
  getCacheKey,
  getOptimalCacheHeaders,
  getClientIP,
  createOptimalResponse,
};
