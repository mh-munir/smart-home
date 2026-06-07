import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

/**
 * Generate main sitemap
 * Includes all main pages and products
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await getProducts().catch(() => []);
    const baseUrl = 'https://smart-home.vercel.app';
    const now = new Date();

    let entries: MetadataRoute.Sitemap = [];

    // Main static pages
    entries.push(
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/best-deals`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/guides`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/review`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }
    );

    // Product pages
    if (products && Array.isArray(products)) {
      (products as any[]).forEach((product) => {
        entries.push({
          url: `${baseUrl}/products/${product.slug || product._id}`,
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
        url: 'https://smart-home.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
