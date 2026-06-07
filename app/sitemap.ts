import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'
import { getHeroSlides } from '@/lib/hero-slides'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, slides] = await Promise.all([
    getProducts(),
    getHeroSlides(),
  ]);

  const baseUrl = 'https://smart-home.vercel.app';

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/best-deals`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/review`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Product pages
  const productPages = (products || []).map((product: any) => ({
    url: `${baseUrl}/products/${product.slug || product._id}`,
    lastModified: new Date(product.updatedAt || product.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...mainPages, ...productPages];
}
