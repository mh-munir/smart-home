import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Guide from '@/models/Guide';
import { requireAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  try {
    await connectDB();
    await Guide.deleteOne({ _id: id });
    return NextResponse.redirect(new URL('/admin/guides', req.url));
  } catch (err) {
    console.error('Error deleting guide', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';