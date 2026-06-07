import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

/**
 * Generate main sitemap
 * Includes all main pages and products
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await getProducts().catch(() => []);
    const now = new Date();

    let entries: MetadataRoute.Sitemap = [];

    // Main static pages
    entries.push(
      {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/products`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/best-deals`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/guides`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/review`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }
    );

    // Product pages
    if (products && Array.isArray(products)) {
      (products as any[]).forEach((product) => {
        entries.push({
          url: `${SITE_URL}/products/${product.slug || product._id}`,
          lastModified: new Date(product.updatedAt || product.createdAt || now),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }

    return entries;
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return minimal fallback
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
