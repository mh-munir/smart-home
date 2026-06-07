import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for Google Ads Conversion Tracking
 * Handles server-side conversion tracking for better reliability
 */
export async function POST(request: NextRequest) {
  try {
    const { eventType, eventData } = await request.json();

    // Validate input
    if (!eventType || !eventData) {
      return NextResponse.json(
        { error: 'Missing eventType or eventData' },
        { status: 400 }
      );
    }

    // Get conversion ID from environment
    const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    if (!conversionId) {
      console.error('Google Ads ID not configured');
      return NextResponse.json(
        { error: 'Tracking not configured' },
        { status: 500 }
      );
    }

    // Log conversion event (can send to external service here)
    console.log('[Conversion Tracking]', {
      timestamp: new Date().toISOString(),
      eventType,
      eventData,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || request.ip,
    });

    // Here you could:
    // 1. Send to Google Ads API for server-side conversion
    // 2. Store in your database for analysis
    // 3. Send to other analytics services
    // 4. Create webhooks for fulfillment

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
 * GET endpoint to test the conversion API
 */
export async function GET() {
  return NextResponse.json({
    status: 'Conversion tracking API is active',
    usage: {
      method: 'POST',
      endpoint: '/api/track-conversion',
      body: {
        eventType: 'purchase|add_to_cart|view_product|newsletter_signup|contact',
        eventData: {
          // Event specific data
        },
      },
    },
  });
}
