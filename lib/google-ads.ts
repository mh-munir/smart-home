/**
 * Google Ads Integration
 * GTM (Google Tag Manager) + GA4 (Google Analytics 4) Setup
 */

// Google Tag Manager Configuration
export const GTM_CONFIG = {
  // Your GTM Container ID (Get from: https://tagmanager.google.com/)
  GTM_ID: 'GTM-NGWRC7R4', // Replace with your GTM ID
  
  // Environment
  ENVIRONMENT: process.env.NODE_ENV || 'production',
};

// Google Analytics 4 Configuration
export const GA4_CONFIG = {
  // Your GA4 Measurement ID (Get from: https://analytics.google.com/)
  MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with your GA4 ID
  
  // Enable debug mode in development
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  
  // Track page views automatically
  AUTO_PAGE_TRACK: true,
  
  // Track scroll depth
  TRACK_SCROLL_DEPTH: true,
  
  // Track engagement
  TRACK_ENGAGEMENT: true,
};

// Google Ads Conversion Configuration
export const GOOGLE_ADS_CONFIG = {
  // Your Google Ads Conversion ID (Get from: https://ads.google.com/)
  CONVERSION_ID: 'AW-XXXXXXXXXX', // Replace with your Conversion ID
  
  // Conversion labels for different actions
  CONVERSION_LABELS: {
    VIEW_PRODUCT: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX',
    ADD_TO_CART: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX',
    PURCHASE: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX',
    CONTACT: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX',
    NEWSLETTER_SIGNUP: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXX_XXXXXXXXXX',
  },
};

// Event tracking configuration
export const TRACKING_EVENTS = {
  // Page view events
  PAGE_VIEW: 'page_view',
  
  // Product events
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  VIEW_CART: 'view_cart',
  PURCHASE: 'purchase',
  
  // User engagement
  SCROLL: 'scroll',
  CLICK: 'click',
  SEARCH: 'search',
  
  // Content engagement
  VIEW_CONTENT: 'view_content',
  SHARE: 'share',
  
  // Lead generation
  GENERATE_LEAD: 'generate_lead',
  CONTACT: 'contact',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  
  // User properties
  SET_USER_ID: 'set_user_id',
};

/**
 * Generate GTM Script
 * Place this in <head> tag
 */
export function generateGTMHeadScript(): string {
  return `
    <!-- Google Tag Manager -->
    <script>
      (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', '${GTM_CONFIG.GTM_ID}');
    </script>
    <!-- End Google Tag Manager -->
  `;
}

/**
 * Generate GTM NoScript
 * Place this in <body> tag (right after opening tag)
 */
export function generateGTMBodyScript(): string {
  return `
    <!-- Google Tag Manager (noscript) -->
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=${GTM_CONFIG.GTM_ID}"
        height="0"
        width="0"
        style="display: none; visibility: hidden;"
      ></iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->
  `;
}

/**
 * Generate GA4 Script
 * Place this in <head> tag
 */
export function generateGA4Script(): string {
  return `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_CONFIG.MEASUREMENT_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA4_CONFIG.MEASUREMENT_ID}', {
        page_path: window.location.pathname,
        ${GA4_CONFIG.DEBUG_MODE ? "debug_mode: true," : ""}
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      });
    </script>
    <!-- End Google Analytics 4 -->
  `;
}

/**
 * Generate Google Ads Conversion Script
 * Place this in <head> tag
 */
export function generateGoogleAdsScript(): string {
  return `
    <!-- Google Ads Conversion Tracking -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONFIG.CONVERSION_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GOOGLE_ADS_CONFIG.CONVERSION_ID}');
      
      // Track conversions
      gtag('config', '${GOOGLE_ADS_CONFIG.CONVERSION_ID}', {
        'conversion_linker': true
      });
    </script>
    <!-- End Google Ads Conversion Tracking -->
  `;
}

/**
 * Track event with GTM/GA4
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
}

/**
 * Track purchase/conversion
 */
export function trackConversion(
  conversionId: string,
  conversionLabel: string,
  value: number,
  currency: string = 'USD'
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      allow_custom_scripts: true,
      send_to: `${conversionId}/${conversionLabel}`,
      value: value,
      currency: currency,
    });
  }
}

/**
 * Set user properties
 */
export function setUserProperty(key: string, value: any): void {
  trackEvent('set_user_property', {
    [key]: value,
  });
}

/**
 * Track product view
 */
export function trackProductView(product: {
  id: string;
  name: string;
  price: number;
  currency: string;
  category?: string;
}): void {
  trackEvent(TRACKING_EVENTS.VIEW_ITEM, {
    value: product.price,
    currency: product.currency,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        currency: product.currency,
        item_category: product.category,
      },
    ],
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}): void {
  trackEvent(TRACKING_EVENTS.ADD_TO_CART, {
    value: product.price * product.quantity,
    currency: product.currency,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

/**
 * Track purchase
 */
export function trackPurchase(data: {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}): void {
  trackEvent(TRACKING_EVENTS.PURCHASE, data);
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string): void {
  trackEvent(TRACKING_EVENTS.SEARCH, {
    search_term: searchTerm,
  });
}

/**
 * Track scroll
 */
export function trackScroll(scrollPercentage: number): void {
  trackEvent(TRACKING_EVENTS.SCROLL, {
    scroll_depth: scrollPercentage,
  });
}

/**
 * Track click
 */
export function trackClick(elementName: string, elementLocation?: string): void {
  trackEvent(TRACKING_EVENTS.CLICK, {
    element_name: elementName,
    element_location: elementLocation,
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(email?: string): void {
  trackEvent(TRACKING_EVENTS.NEWSLETTER_SIGNUP, {
    email: email ? '***' : undefined, // Don't send actual email for privacy
  });
}

/**
 * Track contact form submission
 */
export function trackContactForm(contactType: string): void {
  trackEvent(TRACKING_EVENTS.CONTACT, {
    contact_type: contactType,
  });
}
