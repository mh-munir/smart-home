import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { requireAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> } ) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  try {
    await connectDB();
    await Product.deleteOne({ _id: id });
    return NextResponse.redirect('/admin/products');
  } catch (err) {
    console.error('Error deleting product', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
