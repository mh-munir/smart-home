export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://smart-home-products.vercel.app';

export const SITE_NAME = 'SmartHome Affiliate';
export const SITE_EMAIL = 'support@smart-home-products.vercel.app';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_LOGO = `${SITE_URL}/logo.png`;
