import { NextResponse } from "next/server";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Subscriber from "@/models/Subscriber";

// GET - Fetch all subscribers (admin)
export async function GET(request) {
  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const filter = {};
    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const [subscribers, total] = await Promise.all([
      Subscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscriber.countDocuments(filter),
    ]);

    return NextResponse.json({
      subscribers,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

// POST - Subscribe a new email
export async function POST(request) {
  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ message: "You are already subscribed!", alreadySubscribed: true });
    }

    // Get IP for logging
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || null;

    const subscriber = await Subscriber.create({
      email: normalizedEmail,
      source: "newsletter",
      isActive: true,
      subscribedAt: new Date(),
      ip,
    });

    return NextResponse.json({
      message: "Successfully subscribed! Thank you for joining our newsletter.",
      subscriber: { email: subscriber.email, subscribedAt: subscriber.subscribedAt },
    });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    if (error.code === 11000) {
      return NextResponse.json({ message: "You are already subscribed!", alreadySubscribed: true });
    }
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}