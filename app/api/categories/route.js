import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { requireAdminSession } from '@/lib/admin-auth';

const DEFAULT_CATS = [
  'Smart Home',
  'Smart Locks',
  'Smart Cameras',
  'Smart Lighting',
  'Smart Speakers',
  'Smart Thermostats',
  'Smart Plugs',
  'Accessories',
  'Home Security',
];

export async function GET() {
  try {
    await connectDB();
    // prefer explicit Category collection; fall back to Product distinct categories
    const fromCollection = await Category.find({}).sort({ name: 1 }).lean();
    const namesFromCollection = Array.isArray(fromCollection) ? fromCollection.map((c) => c.name).filter(Boolean) : [];

    const fromProducts = await Product.distinct('category');
    const namesFromProducts = (Array.isArray(fromProducts) ? fromProducts : []).filter(Boolean).map((c) => String(c));

    // If explicit Category collection contains entries, return only those
    if (Array.isArray(namesFromCollection) && namesFromCollection.length > 0) {
      return Response.json(namesFromCollection);
    }

    // Otherwise fall back to product-derived categories, or default list
    const merged = Array.from(new Set([...namesFromProducts]));
    if (merged.length === 0) return Response.json(DEFAULT_CATS);
    return Response.json(merged);
  } catch (err) {
    return Response.json(DEFAULT_CATS);
  }
}

export async function POST(req) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const data = await req.json();
    const name = String(data?.name || '').trim();
    if (!name) return Response.json({ error: 'Invalid category name' }, { status: 400 });

    // case-insensitive check
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existing = await Category.findOne({ name: { $regex: `^${safe}$`, $options: 'i' } });
    if (existing) {
      return Response.json({ ok: true, name: existing.name, _id: existing._id.toString() });
    }

    const created = await Category.create({ name });
    return Response.json({ ok: true, name: created.name, _id: created._id.toString() });
  } catch (err) {
    return Response.json({ error: err?.message || 'Failed to create category' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const data = await req.json().catch(() => ({}));
    const id = data?.id;
    const name = String(data?.name || "").trim();

    if (!id && !name) {
      return Response.json({ error: 'Provide category id or name to delete' }, { status: 400 });
    }

    let removed = null;
    if (id) {
      removed = await Category.findByIdAndDelete(id);
    } else {
      const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      removed = await Category.findOneAndDelete({ name: { $regex: `^${safe}$`, $options: 'i' } });
    }

    if (!removed) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }

    return Response.json({ ok: true, name: removed.name, _id: removed._id.toString() });
  } catch (err) {
    return Response.json({ error: err?.message || 'Failed to delete category' }, { status: 500 });
  }
}
