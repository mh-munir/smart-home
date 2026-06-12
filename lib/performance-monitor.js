/**
 * Performance Monitoring and Analytics for High-Traffic Applications
 * Tracks clicks, conversions, page views, and performance metrics
 */

import { cache, cacheKeys } from './cache.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      totalPageViews: 0,
      totalClicks: 0,
      totalConversions: 0,
      sessionCount: 0,
      requestDuration: [],
      errorCount: 0,
      lastUpdated: new Date(),
    };
    this.sessionStart = Date.now();
  }

  /**
   * Track page view
   */
  trackPageView() {
    this.metrics.totalPageViews++;
    this.metrics.lastUpdated = new Date();
  }

  /**
   * Track affiliate link click
   * @param {string} productId - Product ID/slug
   * @param {string} affiliate - Affiliate program (amazon, aliexpress, etc)
   */
  trackClick(productId, affiliate = 'affiliate') {
    this.metrics.totalClicks++;
    
    // Track individual click
    const clickKey = cacheKeys.clickStats(productId);
    const currentClicks = cache.get(clickKey) || 0;
    cache.set(clickKey, currentClicks + 1, 24 * 60 * 60 * 1000); // 24-hour cache
    
    // Send to analytics (GA, GTM, etc)
    this.sendAnalyticsEvent('click', {
      productId,
      affiliate,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track conversion (purchase)
   * @param {string} productId - Product ID/slug
   * @param {number} value - Purchase value
   * @param {string} affiliate - Affiliate program
   */
  trackConversion(productId, value, affiliate = 'affiliate') {
    this.metrics.totalConversions++;
    
    // Track individual conversion
    const conversionKey = cacheKeys.conversionStats(productId);
    const currentConversions = cache.get(conversionKey) || 0;
    cache.set(conversionKey, currentConversions + 1, 24 * 60 * 60 * 1000);
    
    // Send to analytics
    this.sendAnalyticsEvent('conversion', {
      productId,
      value,
      affiliate,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track API request duration
   * @param {number} duration - Duration in milliseconds
   */
  trackRequestDuration(duration) {
    this.metrics.requestDuration.push(duration);
    
    // Keep only last 1000 measurements
    if (this.metrics.requestDuration.length > 1000) {
      this.metrics.requestDuration.shift();
    }
  }

  /**
   * Track errors
   */
  trackError() {
    this.metrics.errorCount++;
  }

  /**
   * Get performance statistics
   */
  getStats() {
    const avgDuration = this.metrics.requestDuration.length > 0
      ? this.metrics.requestDuration.reduce((a, b) => a + b, 0) / this.metrics.requestDuration.length
      : 0;

    const uptime = (Date.now() - this.sessionStart) / 1000 / 60; // in minutes

    return {
      pageViews: this.metrics.totalPageViews,
      clicks: this.metrics.totalClicks,
      conversions: this.metrics.totalConversions,
      clickToConversionRate: this.metrics.totalClicks > 0
        ? ((this.metrics.totalConversions / this.metrics.totalClicks) * 100).toFixed(2) + '%'
        : '0%',
      averageResponseTime: avgDuration.toFixed(2) + 'ms',
      errors: this.metrics.errorCount,
      uptime: uptime.toFixed(2) + ' minutes',
      lastUpdated: this.metrics.lastUpdated,
    };
  }

  /**
   * Send event to analytics services
   */
  sendAnalyticsEvent(eventName, eventData) {
    if (typeof window !== 'undefined') {
      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }
      
      // Send to GTM dataLayer
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...eventData,
        });
      }
    }
  }

  /**
   * Reset metrics (useful for periodic monitoring)
   */
  reset() {
    this.metrics = {
      totalPageViews: 0,
      totalClicks: 0,
      totalConversions: 0,
      sessionCount: 0,
      requestDuration: [],
      errorCount: 0,
      lastUpdated: new Date(),
    };
  }
}

// Export singleton instance
export const monitor = new PerformanceMonitor();

export default monitor;
