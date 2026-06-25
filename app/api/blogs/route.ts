import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-auth';
import Blog from '@/models/Blog';
import fs from 'fs/promises';
import path from 'path';
import { withRateLimit } from '@/lib/rate-limit';

// Helper function to slugify text for filenames
function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD') // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const body = await request.json();
    const { title, category, content } = body;
    const images = Array.isArray(body.images) ? body.images : [];
    const clientSlug = body.slug as string | undefined;
    const metaTitle = body.metaTitle as string | undefined;
    const metaDescription = body.metaDescription as string | undefined;
    const canonicalUrl = body.canonicalUrl as string | undefined;

    // Validate incoming data (optional, but recommended)
    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Missing required blog fields' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');

    // Ensure the upload directory exists, create it if not
    await fs.mkdir(uploadDir, { recursive: true });

    const savedImageUrls: string[] = [];

    for (const [index, base64Image] of images.entries()) {
      if (typeof base64Image !== 'string') continue;

      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        console.warn('Invalid base64 image format encountered, skipping.');
        continue;
      }

      const imageType = matches[1].split('/')[1]; // e.g., 'png', 'jpeg'
      const imageData = Buffer.from(matches[2], 'base64');

      // Create a unique and slugified filename (truncated to avoid exceeding Windows MAX_PATH)
      const baseFilename = slugify(title).slice(0, 80);
      const filename = `${baseFilename}-${Date.now()}-${index}.${imageType || 'png'}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, imageData);
      savedImageUrls.push(`/uploads/blogs/${filename}`); // Store public URL
    }

    const description = content
      .split(/\n\s*\n/)
      .find((part: string) => part.trim() && !part.trim().startsWith('##'))
      ?.replace(/^#+\s*/, '')
      .trim()
      .slice(0, 180);

    // Use client-provided slug if available, otherwise auto-generate
    const slugBase = clientSlug ? slugify(clientSlug).slice(0, 120) : slugify(title).slice(0, 120);
    let finalSlug = slugBase || `blog-${Date.now()}`;

    // Ensure unique slug
    const existingBlog = await Blog.findOne({ slug: finalSlug });
    if (existingBlog) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const newBlog = await Blog.create({
      title,
      slug: finalSlug,
      category,
      content,
      description: description || '',
      image: savedImageUrls[0] || '',
      images: savedImageUrls,
      imageUrls: savedImageUrls,
      published: true,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      canonicalUrl: canonicalUrl || null,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${newBlog.slug}`);

    return NextResponse.json({ message: 'Blog published successfully!', blog: newBlog }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error publishing blog:', error);
    const message = error instanceof Error ? error.message : 'Failed to publish blog';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
