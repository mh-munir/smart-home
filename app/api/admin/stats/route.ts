import { NextResponse } from 'next/server';
import { connectDB, hasMongoDBConfig } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-auth';
import Product from '@/models/Product';
import Blog from '@/models/Blog';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: 'MONGODB_URI not configured' }, { status: 500 });
  }

  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    const [productAgg = {}] = await Product.aggregate([
      {
        $group: {
          _id: null,
          clicksSum: { $sum: '$clicks' },
          conversionsSum: { $sum: '$conversions' },
          viewsSum: { $sum: '$views' },
        },
      },
    ]);

    const [blogAgg = {}] = await Blog.aggregate([
      {
        $group: {
          _id: null,
          clicksSum: { $sum: '$clicks' },
          viewsSum: { $sum: '$views' },
        },
      },
    ]);

    const affiliateClicks = (productAgg.clicksSum || 0) + (blogAgg.clicksSum || 0);
    const conversions = productAgg.conversionsSum || 0;
    const websiteVisits = (productAgg.viewsSum || 0) + (blogAgg.viewsSum || 0);
    const conversionRate = affiliateClicks > 0 ? ((conversions / affiliateClicks) * 100).toFixed(1) : '0.0';

    const topProducts = await Product.find({})
      .sort({ clicks: -1 })
      .limit(5)
      .select('title clicks')
      .lean();

    const topArticles = await Blog.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title views')
      .lean();

    return NextResponse.json({
      totalProducts,
      totalBlogs,
      affiliateClicks,
      conversions,
      websiteVisits,
      conversionRate,
      topProducts,
      topArticles,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
