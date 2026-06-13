/**
 * Multi-Affiliate Network Configuration
 * Centralized configuration for all supported affiliate programs
 */

export interface AffiliateNetwork {
  id: string;
  name: string;
  url?: string;
  logo?: string;
  isEnabled: boolean;
  priority: number;
  commission?: string;
  description?: string;
  trackingPrefix?: string;
}

// Supported affiliate networks
export const AFFILIATE_NETWORKS: Record<string, AffiliateNetwork> = {
  amazon: {
    id: "amazon",
    name: "Amazon Associates",
    url: "https://amazon.com",
    isEnabled: !!process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG,
    priority: 1,
    commission: "Up to 10%",
    description: "Amazon Associates Program",
    trackingPrefix: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "",
  },
  aliexpress: {
    id: "aliexpress",
    name: "AliExpress Affiliate",
    url: "https://aliexpress.com",
    isEnabled: !!process.env.NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID,
    priority: 2,
    commission: "2-10%",
    description: "AliExpress Affiliate Program",
    trackingPrefix: process.env.NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID || "",
  },
  ebay: {
    id: "ebay",
    name: "eBay Partner",
    url: "https://ebay.com",
    isEnabled: !!process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID,
    priority: 3,
    commission: "4-8%",
    description: "eBay Partner Network",
    trackingPrefix: process.env.NEXT_PUBLIC_EBAY_CAMPAIGN_ID || "",
  },
  flipkart: {
    id: "flipkart",
    name: "Flipkart Affiliate",
    url: "https://flipkart.com",
    isEnabled: !!process.env.NEXT_PUBLIC_FLIPKART_AFFILIATE_ID,
    priority: 4,
    commission: "4-8%",
    description: "Flipkart Affiliate Program",
    trackingPrefix: process.env.NEXT_PUBLIC_FLIPKART_AFFILIATE_ID || "",
  },
  daraz: {
    id: "daraz",
    name: "Daraz Affiliate",
    url: "https://daraz.com.bd",
    isEnabled: !!process.env.NEXT_PUBLIC_DARAZ_AFFILIATE_ID,
    priority: 5,
    commission: "3-8%",
    description: "Daraz Affiliate Program",
    trackingPrefix: process.env.NEXT_PUBLIC_DARAZ_AFFILIATE_ID || "",
  },
  rokomari: {
    id: "rokomari",
    name: "Rokomari Affiliate",
    url: "https://rokomari.com",
    isEnabled: !!process.env.NEXT_PUBLIC_ROKOMARI_AFFILIATE_ID,
    priority: 6,
    commission: "5-15%",
    description: "Rokomari Affiliate Program",
    trackingPrefix: process.env.NEXT_PUBLIC_ROKOMARI_AFFILIATE_ID || "",
  },
  ajio: {
    id: "ajio",
    name: "AJIO Affiliate",
    url: "https://ajio.com",
    isEnabled: !!process.env.NEXT_PUBLIC_AJIO_AFFILIATE_ID,
    priority: 7,
    commission: "4-8%",
    description: "AJIO Affiliate Program",
    trackingPrefix: process.env.NEXT_PUBLIC_AJIO_AFFILIATE_ID || "",
  },
};

/**
 * Get all enabled affiliate networks
 */
export const getEnabledAffiliates = (): AffiliateNetwork[] => {
  return Object.values(AFFILIATE_NETWORKS)
    .filter((network) => network.isEnabled)
    .sort((a, b) => a.priority - b.priority);
};

/**
 * Get a specific affiliate network by ID
 */
export const getAffiliateNetwork = (id: string): AffiliateNetwork | null => {
  return AFFILIATE_NETWORKS[id] || null;
};

/**
 * Check if an affiliate network is enabled
 */
export const isAffiliateEnabled = (id: string): boolean => {
  return AFFILIATE_NETWORKS[id]?.isEnabled ?? false;
};

/**
 * Get tracking prefix for affiliate network
 */
export const getTrackingPrefix = (id: string): string => {
  return AFFILIATE_NETWORKS[id]?.trackingPrefix || "";
};

/**
 * Get default affiliate network (highest priority enabled)
 */
export const getDefaultAffiliate = (): AffiliateNetwork | null => {
  const enabled = getEnabledAffiliates();
  return enabled.length > 0 ? enabled[0] : null;
};
