import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';

export async function POST(req: NextRequest, { params }) {
  const { id } = params;
  try {
    await connectDB();
    await Blog.deleteOne({ _id: id });
    return NextResponse.redirect('/admin/blogs');
  } catch (err) {
    console.error('Error deleting blog', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
