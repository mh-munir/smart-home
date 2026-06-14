import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { requireAdminSession } from '@/lib/admin-auth';

/**
 * API Route for Multi-Affiliate Conversion Tracking
 * Handles server-side conversion tracking for affiliate networks
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    const { eventType, eventData, productId, affiliateId, type } = body;

    // Support both old format and new multi-affiliate format
    if (productId && affiliateId) {
      return handleAffiliateTracking(productId, affiliateId, type);
    }

    // Legacy Google Ads tracking
    if (!eventType || !eventData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    if (!conversionId) {
      console.error('Google Ads ID not configured');
      return NextResponse.json(
        { error: 'Tracking not configured' },
        { status: 500 }
      );
    }

    console.log('[Conversion Tracking]', {
      timestamp: new Date().toISOString(),
      eventType,
      eventData,
      userAgent: request.headers.get('user-agent'),
      ipAddress:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip'),
    });

    return NextResponse.json({
      success: true,
      message: 'Conversion tracked successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}

/**
 * Handle affiliate-specific tracking
 */
async function handleAffiliateTracking(
  productId: string,
  affiliateId: string,
  type: 'click' | 'conversion' = 'click'
): Promise<NextResponse> {
  try {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Initialize affiliateLinks if it doesn't exist
    if (!product.affiliateLinks) {
      product.affiliateLinks = new Map();
    }

    // Get or create affiliate entry
    if (!product.affiliateLinks.has(affiliateId)) {
      product.affiliateLinks.set(affiliateId, {
        clicks: 0,
        conversions: 0,
        enabled: true,
      });
    }

    const affiliateData = product.affiliateLinks.get(affiliateId);

    // Increment appropriate counter
    if (type === 'click') {
      affiliateData.clicks = (affiliateData.clicks || 0) + 1;
      product.clicks = (product.clicks || 0) + 1;
    } else if (type === 'conversion') {
      affiliateData.conversions = (affiliateData.conversions || 0) + 1;
      product.conversions = (product.conversions || 0) + 1;
    }

    // Update the map
    product.affiliateLinks.set(affiliateId, affiliateData);

    // Save product
    await product.save();

    console.log(`[Affiliate Tracking] ${type.toUpperCase()}`, {
      productId,
      affiliateId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Affiliate ${type} tracked successfully`,
      data: {
        productId,
        affiliateId,
        type,
        [type]: type === 'click' ? affiliateData.clicks : affiliateData.conversions,
      },
    });
  } catch (error) {
    console.error('Affiliate tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track affiliate action' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to test the conversion API
 */
export async function GET() {
  return NextResponse.json({
    status: 'Conversion tracking API is active',
    usage: {
      affiliateTracking: {
        method: 'POST',
        endpoint: '/api/track-conversion',
        body: {
          productId: 'product_id',
          affiliateId: 'amazon|aliexpress|ebay|flipkart|daraz|rokomari|ajio',
          type: 'click|conversion',
        },
      },
      legacyTracking: {
        method: 'POST',
        endpoint: '/api/track-conversion',
        body: {
          eventType: 'purchase|add_to_cart|view_product|newsletter_signup|contact',
          eventData: {},
        },
      },
    },
  });
}

