/**
 * Multi-Country SEO Configuration
 * Supports Amazon marketplace countries with hreflang tags
 */

import { SITE_URL } from '@/lib/site';

export interface CountryConfig {
  code: string; // ISO 3166-1 alpha-2
  locale: string; // BCP 47 language tag
  domain: string; // Country-specific domain
  currency: string; // Currency code
  language: string; // Display language
  name: string; // Country name
  amazonUrl: string; // Amazon marketplace URL
}

// All countries where Amazon operates
export const AMAZON_COUNTRIES: Record<string, CountryConfig> = {
  US: {
    code: 'US',
    locale: 'en-US',
    domain: SITE_URL,
    currency: 'USD',
    language: 'English',
    name: 'United States',
    amazonUrl: 'https://www.amazon.com',
  },
  GB: {
    code: 'GB',
    locale: 'en-GB',
    domain: `${SITE_URL}/en-gb`,
    currency: 'GBP',
    language: 'English',
    name: 'United Kingdom',
    amazonUrl: 'https://www.amazon.co.uk',
  },
  DE: {
    code: 'DE',
    locale: 'de-DE',
    domain: `${SITE_URL}/de`,
    currency: 'EUR',
    language: 'Deutsch',
    name: 'Germany',
    amazonUrl: 'https://www.amazon.de',
  },
  FR: {
    code: 'FR',
    locale: 'fr-FR',
    domain: `${SITE_URL}/fr`,
    currency: 'EUR',
    language: 'Français',
    name: 'France',
    amazonUrl: 'https://www.amazon.fr',
  },
  IT: {
    code: 'IT',
    locale: 'it-IT',
    domain: `${SITE_URL}/it`,
    currency: 'EUR',
    language: 'Italiano',
    name: 'Italy',
    amazonUrl: 'https://www.amazon.it',
  },
  ES: {
    code: 'ES',
    locale: 'es-ES',
    domain: `${SITE_URL}/es`,
    currency: 'EUR',
    language: 'Español',
    name: 'Spain',
    amazonUrl: 'https://www.amazon.es',
  },
  CA: {
    code: 'CA',
    locale: 'en-CA',
    domain: `${SITE_URL}/en-ca`,
    currency: 'CAD',
    language: 'English',
    name: 'Canada',
    amazonUrl: 'https://www.amazon.ca',
  },
  MX: {
    code: 'MX',
    locale: 'es-MX',
    domain: `${SITE_URL}/es-mx`,
    currency: 'MXN',
    language: 'Español',
    name: 'Mexico',
    amazonUrl: 'https://www.amazon.com.mx',
  },
  BR: {
    code: 'BR',
    locale: 'pt-BR',
    domain: `${SITE_URL}/pt-br`,
    currency: 'BRL',
    language: 'Português',
    name: 'Brazil',
    amazonUrl: 'https://www.amazon.com.br',
  },
  JP: {
    code: 'JP',
    locale: 'ja-JP',
    domain: `${SITE_URL}/ja`,
    currency: 'JPY',
    language: '日本語',
    name: 'Japan',
    amazonUrl: 'https://www.amazon.co.jp',
  },
  AU: {
    code: 'AU',
    locale: 'en-AU',
    domain: `${SITE_URL}/en-au`,
    currency: 'AUD',
    language: 'English',
    name: 'Australia',
    amazonUrl: 'https://www.amazon.com.au',
  },
  IN: {
    code: 'IN',
    locale: 'en-IN',
    domain: `${SITE_URL}/en-in`,
    currency: 'INR',
    language: 'English',
    name: 'India',
    amazonUrl: 'https://www.amazon.in',
  },
  NL: {
    code: 'NL',
    locale: 'nl-NL',
    domain: `${SITE_URL}/nl`,
    currency: 'EUR',
    language: 'Nederlands',
    name: 'Netherlands',
    amazonUrl: 'https://www.amazon.nl',
  },
  SE: {
    code: 'SE',
    locale: 'sv-SE',
    domain: `${SITE_URL}/sv`,
    currency: 'SEK',
    language: 'Svenska',
    name: 'Sweden',
    amazonUrl: 'https://www.amazon.se',
  },
  PL: {
    code: 'PL',
    locale: 'pl-PL',
    domain: `${SITE_URL}/pl`,
    currency: 'PLN',
    language: 'Polski',
    name: 'Poland',
    amazonUrl: 'https://www.amazon.pl',
  },
  EG: {
    code: 'EG',
    locale: 'ar-EG',
    domain: `${SITE_URL}/ar-eg`,
    currency: 'EGP',
    language: 'العربية',
    name: 'Egypt',
    amazonUrl: 'https://www.amazon.eg',
  },
  SA: {
    code: 'SA',
    locale: 'ar-SA',
    domain: `${SITE_URL}/ar-sa`,
    currency: 'SAR',
    language: 'العربية',
    name: 'Saudi Arabia',
    amazonUrl: 'https://www.amazon.sa',
  },
  AE: {
    code: 'AE',
    locale: 'ar-AE',
    domain: `${SITE_URL}/ar-ae`,
    currency: 'AED',
    language: 'العربية',
    name: 'United Arab Emirates',
    amazonUrl: 'https://www.amazon.ae',
  },
  SG: {
    code: 'SG',
    locale: 'en-SG',
    domain: `${SITE_URL}/en-sg`,
    currency: 'SGD',
    language: 'English',
    name: 'Singapore',
    amazonUrl: 'https://www.amazon.sg',
  },
};

// Get country config by code
export function getCountryConfig(countryCode: string): CountryConfig {
  return AMAZON_COUNTRIES[countryCode.toUpperCase()] || AMAZON_COUNTRIES['US'];
}

// Generate hreflang links for all countries
export function generateHrefLangLinks(): Array<{ rel: string; hrefLang: string; href: string }> {
  const links: Array<{ rel: string; hrefLang: string; href: string }> = [];

  // Add all country versions
  Object.values(AMAZON_COUNTRIES).forEach((country) => {
    links.push({
      rel: 'alternate',
      hrefLang: country.locale.replace('_', '-'),
      href: country.domain,
    });
  });

  // Add generic x-default for English
  links.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: AMAZON_COUNTRIES['US'].domain,
  });

  return links;
}

// Get currency symbol
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    BRL: 'R$',
    MXN: '$',
    AED: 'د.إ',
    SAR: '﷼',
    EGP: '£',
    PLN: 'zł',
    SEK: 'kr',
    NL: '€',
  };
  return symbols[currency] || currency;
}

// Get available locales
export function getAvailableLocales(): string[] {
  return Object.values(AMAZON_COUNTRIES).map((c) => c.locale);
}

// Get locale by country code
export function getLocaleByCountry(countryCode: string): string {
  const country = getCountryConfig(countryCode);
  return country.locale;
}
