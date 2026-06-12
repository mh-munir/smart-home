/**
 * Google AdSense Configuration
 */

export const ADSENSE_CONFIG = {
  // Your AdSense Publisher ID
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
  // Your AdSense Customer ID
  customerId: process.env.NEXT_PUBLIC_ADSENSE_CUSTOMER_ID,
  // Whether AdSense is enabled
  enabled: !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
  // Ad slots for different placements
  slots: {
    topBanner: process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT,
    inContent: process.env.NEXT_PUBLIC_ADSENSE_IN_CONTENT_SLOT,
    bottomBanner: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT,
  },
};

export const isAdSenseEnabled = () => {
  return ADSENSE_CONFIG.enabled && ADSENSE_CONFIG.publisherId;
};

export const getAdSlot = (placement) => {
  return ADSENSE_CONFIG.slots[placement];
};
