import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";

/**
 * GET /api/validate-slug?slug=xxx&type=product|blog&excludeId=yyy
 *
 * Returns { available: true/false } to indicate whether a slug is unique.
 * `excludeId` is optional — used when editing an existing record.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug")?.trim();
    const type = searchParams.get("type") || "product";
    const excludeId = searchParams.get("excludeId");

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await connectDB();

    let exists;

    if (type === "blog") {
      const query: Record<string, unknown> = { slug };
      if (excludeId) query._id = { $ne: excludeId };
      exists = await Blog.exists(query);
    } else {
      const query: Record<string, unknown> = { slug };
      if (excludeId) query._id = { $ne: excludeId };
      exists = await Product.exists(query);
    }

    return NextResponse.json({ available: !exists });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Validation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}