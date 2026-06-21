import { NextResponse } from "next/server";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Subscriber from "@/models/Subscriber";
import { requireAdminSession } from "@/lib/admin-auth";

// PUT - Soft-delete (deactivate) a subscriber
export async function PUT(request, { params }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const { id } = await params;
    const updated = await Subscriber.findByIdAndUpdate(
      id,
      { isActive: false },
      { returnDocument: "after" }
    );

    if (!updated) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscriber deactivated", subscriber: updated });
  } catch (error) {
    console.error("Error deactivating subscriber:", error);
    return NextResponse.json({ error: "Failed to deactivate subscriber" }, { status: 500 });
  }
}

// DELETE - Permanently remove a subscriber
export async function DELETE(request, { params }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const { id } = await params;
    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscriber removed successfully" });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
