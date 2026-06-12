/**
 * Advanced In-Memory Cache Layer for High-Traffic Applications
 * Provides L1 (memory) caching for frequently accessed data
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.expiryTimers = new Map();
  }

  /**
   * Set cache value with TTL
   * @param {string} key - Cache key
   * @param {any} value - Cache value
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    // Clear existing timer if any
    if (this.expiryTimers.has(key)) {
      clearTimeout(this.expiryTimers.get(key));
    }

    // Set cache value
    this.cache.set(key, value);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.expiryTimers.delete(key);
      console.log(`Cache expired: ${key}`);
    }, ttl);

    this.expiryTimers.set(key, timer);
  }

  /**
   * Get cache value
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null
   */
  get(key) {
    return this.cache.get(key) || null;
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} - Whether key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete specific cache key
   * @param {string} key - Cache key
   */
  delete(key) {
    if (this.expiryTimers.has(key)) {
      clearTimeout(this.expiryTimers.get(key));
      this.expiryTimers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.expiryTimers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.expiryTimers.clear();
    console.log("Cache cleared");
  }

  /**
   * Get cache statistics
   * @returns {object} - Cache stats
   */
  stats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Get or set value with fallback function
   * @param {string} key - Cache key
   * @param {function} fallback - Function to call if cache miss
   * @param {number} ttl - Time to live
   * @returns {any} - Cached or computed value
   */
  async getOrSet(key, fallback, ttl = 5 * 60 * 1000) {
    if (this.has(key)) {
      console.log(`Cache hit: ${key}`);
      return this.get(key);
    }

    console.log(`Cache miss: ${key}, computing...`);
    const value = await fallback();
    this.set(key, value, ttl);
    return value;
  }
}

// Export singleton instance
export const cache = new MemoryCache();

/**
 * Cache key builder for consistent key generation
 */
export const cacheKeys = {
  products: () => "products:all",
  product: (slug) => `product:${slug}`,
  blogs: () => "blogs:all",
  blog: (slug) => `blog:${slug}`,
  categories: () => "categories:all",
  heroSlides: () => "hero-slides:all",
  clickStats: (productId) => `clicks:${productId}`,
  conversionStats: (productId) => `conversions:${productId}`,
};

/**
 * Clear related caches (useful for cache invalidation)
 */
export const invalidateCache = (pattern) => {
  const { keys } = cache.stats();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.delete(key);
      console.log(`Invalidated cache: ${key}`);
    }
  });
};

export default cache;
