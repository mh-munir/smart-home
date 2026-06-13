import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

/**
 * API Route for Affiliate Statistics
 * Get affiliate performance data for products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    await connectDB();

    if (productId) {
      // Get stats for a specific product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      const affiliates: Record<string, any> = {};

      if (product.affiliateLinks && product.affiliateLinks.size > 0) {
        for (const [affiliateId, data] of product.affiliateLinks) {
          affiliates[String(affiliateId)] = {
            url: data.url || null,
            enabled: data.enabled || false,
            clicks: data.clicks || 0,
            conversions: data.conversions || 0,
            conversionRate:
              (data.clicks || 0) > 0
                ? (((data.conversions || 0) / (data.clicks || 0)) * 100).toFixed(2)
                : '0',
          };
        }
      }

      const stats = {
        productId: product._id,
        title: product.title,
        totalClicks: product.clicks || 0,
        totalConversions: product.conversions || 0,
        affiliates,
      };

      return NextResponse.json({ success: true, data: stats });
    }

    // Get stats for all products
    const products = await Product.find()
      .select('_id title clicks conversions affiliateLinks')
      .lean();

    const allStats = products.map((product: any) => {
      const affiliates: Record<string, any> = {};

      if (product.affiliateLinks && product.affiliateLinks.size > 0) {
        for (const [affiliateId, data] of product.affiliateLinks) {
          affiliates[String(affiliateId)] = {
            clicks: data.clicks || 0,
            conversions: data.conversions || 0,
            conversionRate:
              (data.clicks || 0) > 0
                ? (((data.conversions || 0) / (data.clicks || 0)) * 100).toFixed(2)
                : '0',
          };
        }
      }

      return {
        productId: product._id.toString(),
        title: product.title,
        totalClicks: product.clicks || 0,
        totalConversions: product.conversions || 0,
        conversionRate:
          (product.clicks || 0) > 0
            ? (((product.conversions || 0) / (product.clicks || 0)) * 100).toFixed(2)
            : '0',
        affiliates,
      };
    });

    return NextResponse.json({
      success: true,
      data: allStats,
      total: allStats.length,
    });
  } catch (error) {
    console.error('Affiliate stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliate statistics' },
      { status: 500 }
    );
  }
}
