/**
 * Multi-Affiliate Utilities
 * Handles affiliate link generation, tracking, and conversions
 */

import { AFFILIATE_NETWORKS, getEnabledAffiliates } from "./affiliate-config";

export interface AffiliateTrack {
  affiliateId: string;
  url: string;
  enabled: boolean;
  priority: number;
  clicks: number;
  conversions: number;
}

/**
 * Generate affiliate link for a specific network
 * @param affiliateId - The affiliate network ID
 * @param productUrl - The product URL
 * @param params - Additional URL parameters
 * @returns Generated affiliate URL
 */
export const generateAffiliateLink = (
  affiliateId: string,
  productUrl: string,
  params: Record<string, string> = {}
): string => {
  const network = AFFILIATE_NETWORKS[affiliateId];
  if (!network || !network.isEnabled) {
    return productUrl;
  }

  const url = new URL(productUrl);

  switch (affiliateId) {
    case "amazon":
      // Amazon Associates format
      if (network.trackingPrefix) {
        url.searchParams.set("tag", network.trackingPrefix);
      }
      break;

    case "aliexpress":
      // AliExpress affiliate format
      if (network.trackingPrefix) {
        url.searchParams.set("aff_fcid", network.trackingPrefix);
      }
      break;

    case "ebay":
      // eBay partner format
      if (network.trackingPrefix) {
        url.searchParams.set("campid", network.trackingPrefix);
      }
      break;

    case "flipkart":
      // Flipkart affiliate format
      if (network.trackingPrefix) {
        url.searchParams.set("affid", network.trackingPrefix);
      }
      break;

    case "daraz":
      // Daraz affiliate format
      if (network.trackingPrefix) {
        url.searchParams.set("aff_track", network.trackingPrefix);
      }
      break;

    case "rokomari":
      // Rokomari affiliate format
      if (network.trackingPrefix) {
        url.searchParams.set("aff_id", network.trackingPrefix);
      }
      break;

    case "ajio":
      // AJIO affiliate format
      if (network.trackingPrefix) {
        url.searchParams.set("utm_source", "affiliate");
        url.searchParams.set("utm_medium", network.trackingPrefix);
      }
      break;
  }

  // Add any custom parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
};

/**
 * Get best affiliate link for a product
 * Returns the highest priority enabled affiliate link
 * @param affiliateLinks - Map of affiliate links by ID
 * @returns Best affiliate link or null
 */
export const getBestAffiliateLink = (
  affiliateLinks: Record<string, any>
): string | null => {
  const enabled = getEnabledAffiliates();

  for (const network of enabled) {
    const link = affiliateLinks[network.id];
    if (link?.url && link.enabled) {
      return link.url;
    }
  }

  return null;
};

/**
 * Get all active affiliate links for a product
 * @param affiliateLinks - Map of affiliate links by ID
 * @returns Array of enabled affiliate links with network info
 */
export const getActiveAffiliateLinks = (
  affiliateLinks: Record<string, any>
): Array<{
  id: string;
  name: string;
  url: string;
  priority: number;
  clicks: number;
  conversions: number;
}> => {
  const links: Array<{
    id: string;
    name: string;
    url: string;
    priority: number;
    clicks: number;
    conversions: number;
  }> = [];

  const enabled = getEnabledAffiliates();

  for (const network of enabled) {
    const link = affiliateLinks[network.id];
    if (link?.url && link.enabled) {
      links.push({
        id: network.id,
        name: network.name,
        url: link.url,
        priority: network.priority,
        clicks: link.clicks || 0,
        conversions: link.conversions || 0,
      });
    }
  }

  return links.sort((a, b) => a.priority - b.priority);
};

/**
 * Create affiliate tracking object for database
 * @param affiliateLinks - Object with affiliate URLs by ID
 * @returns Affiliate tracking object
 */
export const createAffiliateTrackingObject = (
  affiliateLinks: Record<string, string>
): Record<string, AffiliateTrack> => {
  const trackingObj: Record<string, AffiliateTrack> = {};

  Object.entries(affiliateLinks).forEach(([affiliateId, url]) => {
    const network = AFFILIATE_NETWORKS[affiliateId];
    if (network) {
      trackingObj[affiliateId] = {
        affiliateId,
        url,
        enabled: network.isEnabled,
        priority: network.priority,
        clicks: 0,
        conversions: 0,
      };
    }
  });

  return trackingObj;
};

/**
 * Track affiliate click
 * @param productId - Product ID
 * @param affiliateId - Affiliate network ID
 */
export const trackAffiliateClick = async (
  productId: string,
  affiliateId: string
): Promise<void> => {
  try {
    const response = await fetch("/api/track-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        affiliateId,
        type: "click",
      }),
    });

    if (!response.ok) {
      console.error("Failed to track affiliate click");
    }
  } catch (error) {
    console.error("Error tracking affiliate click:", error);
  }
};

/**
 * Track affiliate conversion
 * @param productId - Product ID
 * @param affiliateId - Affiliate network ID
 */
export const trackAffiliateConversion = async (
  productId: string,
  affiliateId: string
): Promise<void> => {
  try {
    const response = await fetch("/api/track-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        affiliateId,
        type: "conversion",
      }),
    });

    if (!response.ok) {
      console.error("Failed to track affiliate conversion");
    }
  } catch (error) {
    console.error("Error tracking affiliate conversion:", error);
  }
};

/**
 * Get affiliate statistics
 * @param productId - Product ID
 * @returns Affiliate performance stats
 */
export const getAffiliateStats = async (productId: string) => {
  try {
    const response = await fetch(`/api/affiliate-stats?productId=${productId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
  }
  return null;
};
