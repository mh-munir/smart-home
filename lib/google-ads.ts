/**
 * Google Analytics / Tag Manager Integration
 *
 * GTM (Google Tag Manager) + GA4 (Google Analytics 4) helpers.
 *
 * Note: Google Ads (Paid Ads) has been removed. Only AdSense is used for
 * monetisation — see components/GoogleAdSenseScript.tsx.
 *
 * The actual <Script> tags for GTM and GA4 live in app/layout.tsx <head>
 * (afterInteractive). This module only exports *runtime* helpers that
 * client components can call to push events into `window.dataLayer`.
 */

// ── Configuration ───────────────────────────────────────────────────────────

// Google Tag Manager
export const GTM_CONFIG = {
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NGWRC7R4',
  ENVIRONMENT: process.env.NODE_ENV || 'production',
};

// Google Analytics 4
export const GA4_CONFIG = {
  MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXXXXX',
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  AUTO_PAGE_TRACK: true,
  TRACK_SCROLL_DEPTH: true,
  TRACK_ENGAGEMENT: true,
};

// ── Event Names ─────────────────────────────────────────────────────────────

export const TRACKING_EVENTS = {
  PAGE_VIEW: 'page_view',
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  VIEW_CART: 'view_cart',
  PURCHASE: 'purchase',
  SCROLL: 'scroll',
  CLICK: 'click',
  SEARCH: 'search',
  VIEW_CONTENT: 'view_content',
  SHARE: 'share',
  GENERATE_LEAD: 'generate_lead',
  CONTACT: 'contact',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  SET_USER_ID: 'set_user_id',
} as const;

// ── Runtime Helpers (client-side only) ──────────────────────────────────────

/**
 * Push a custom event into `window.dataLayer` for GTM / GA4.
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, unknown>,
): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
}

/**
 * Set a GA4 user property.
 */
export function setUserProperty(key: string, value: unknown): void {
  trackEvent('set_user_property', {
    [key]: value,
  } as Record<string, unknown>);
}

/**
 * Track a product view event.
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
 * Track an add-to-cart event.
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
        currency: product.currency,
      },
    ],
  });
}

/**
 * Track a purchase event.
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
 * Track a search event.
 */
export function trackSearch(searchTerm: string): void {
  trackEvent(TRACKING_EVENTS.SEARCH, {
    search_term: searchTerm,
  });
}

/**
 * Track a scroll-depth event.
 */
export function trackScroll(scrollPercentage: number): void {
  trackEvent(TRACKING_EVENTS.SCROLL, {
    scroll_depth: scrollPercentage,
  });
}

/**
 * Track a click event.
 */
export function trackClick(elementName: string, elementLocation?: string): void {
  trackEvent(TRACKING_EVENTS.CLICK, {
    element_name: elementName,
    element_location: elementLocation,
  });
}

/**
 * Track a newsletter sign-up event.
 */
export function trackNewsletterSignup(email?: string): void {
  trackEvent(TRACKING_EVENTS.NEWSLETTER_SIGNUP, {
    email: email ? '***' : undefined, // redact for privacy
  });
}

/**
 * Track a contact form submission event.
 */
export function trackContactForm(contactType: string): void {
  trackEvent(TRACKING_EVENTS.CONTACT, {
    contact_type: contactType,
  });
}

// ── Global type augmentations ───────────────────────────────────────────────

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
