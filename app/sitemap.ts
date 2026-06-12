import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'
import { blogArticles, getAllBlogCategories } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

/**
 * Generate main sitemap
 * Includes all main pages, blog articles, categories, and products
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
        url: `${SITE_URL}/blog`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.95,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/contact`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/author`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/privacy-policy`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/terms`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/cookie-policy`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/disclaimer`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/affiliate-disclosure`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
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
        url: `${SITE_URL}/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }
    );

    // Blog articles
    blogArticles.forEach((article) => {
      entries.push({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });

    // Blog categories
    const categories = getAllBlogCategories();
    categories.forEach((category) => {
      entries.push({
        url: `${SITE_URL}/category/${category}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    });

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
